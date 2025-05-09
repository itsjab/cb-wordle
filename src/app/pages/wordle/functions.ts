"use server";

import { requestInfo } from "rwsdk/worker";
import { db } from "@/db";

type LetterState = "correct" | "present" | "absent";
type LetterResult = { letter: string; state: LetterState };

export async function getOrCreateActiveGame() {
  const { ctx } = requestInfo;

  if (!ctx.user) {
    throw new Error("User not authenticated");
  }

  const game = await db.game.findFirst({
    where: {
      userId: ctx.user.id,
      isArchived: false,
    },
    include: {
      guesses: true,
    },
  });

  if (game) {
    return game;
  }

  const words = [
    "APPLE",
    "BEACH",
    "CLOUD",
    "DANCE",
    "EARTH",
    "FLAME",
    "GRAPE",
    "HOUSE",
    "IVORY",
    "JELLY",
  ];
  const randomWord = words[Math.floor(Math.random() * words.length)];

  return db.game.create({
    data: {
      userId: ctx.user.id,
      status: "active",
      wordle: randomWord,
    },
    include: {
      guesses: true,
    },
  });
}

export async function archiveGame(gameId: string) {
  const { ctx } = requestInfo;

  if (!ctx.user) {
    throw new Error("User not authenticated");
  }
  const game = await db.game.findUnique({
    where: { id: gameId },
  });

  if (!game) {
    throw new Error("Game not found");
  }
  if (game.userId !== ctx.user.id) {
    throw new Error("Not authorized to access this game");
  }

  if (game.isArchived) {
    throw new Error("Game is already archived");
  }

  // Archive the game
  await db.game.update({
    where: { id: gameId },
    data: { isArchived: true },
  });
}

export async function submitGuess(gameId: string, guessWord: string) {
  const { ctx } = requestInfo;

  if (!ctx.user) {
    throw new Error("User not authenticated");
  }

  if (guessWord.length !== 5) {
    throw new Error("Guess must be 5 letters");
  }

  // Get the game
  const game = await db.game.findUnique({
    where: { id: gameId },
    include: {
      guesses: {
        orderBy: {
          attempt: "asc",
        },
      },
    },
  });

  if (!game) {
    throw new Error("Game not found");
  }

  if (game.userId !== ctx.user.id) {
    throw new Error("Not authorized to access this game");
  }

  if (game.status !== "active") {
    throw new Error("Game is not active");
  }

  if (game.guesses.length >= 6) {
    throw new Error("Maximum number of guesses reached");
  }

  const targetWord = game.wordle;
  const result = calculateGuessResult(guessWord, targetWord);

  await db.guess.create({
    data: {
      gameId,
      guess: guessWord,
      attempt: game.guesses.length + 1,
      result,
    },
  });

  const newStatus = determineGameStatus(
    guessWord,
    targetWord,
    game.guesses.length + 1
  );

  if (newStatus !== "active") {
    await db.game.update({
      where: { id: gameId },
      data: { status: newStatus },
    });
  }

  return db.game.findUnique({
    where: { id: gameId },
    include: {
      guesses: {
        orderBy: {
          attempt: "asc",
        },
      },
    },
  });
}

export async function getJabs() {
  const { ctx } = requestInfo;

  if (!ctx.user) {
    throw new Error("User not authenticated");
  }

  const jabs = await db.jab.findMany({ take: 6 });

  return jabs;
}

export async function getLeaderboard() {
  const games = await db.game.findMany({
    where: {
      status: "won",
    },
    include: {
      user: true,
      guesses: true,
    },
    orderBy: {
      guesses: {
        _count: "asc",
      },
    },
  });

  // Prepare leaderboard entries
  const entries = games.map((game) => {
    const turns = game.guesses.length;
    if (turns === 1) {
      return {
        username: game.user.username,
        turns,
        timeSeconds: 0,
        status: game.status,
        gameId: game.id,
        ranking: null, // will be set after sorting
      };
    }
    const first = game.guesses[0].createdAt;
    const last = game.guesses[turns - 1].createdAt;
    return {
      username: game.user.username,
      turns,
      timeSeconds: (last.getTime() - first.getTime()) / 1000,
      status: game.status,
      gameId: game.id,
      ranking: null, // will be set after sorting
    };
  });

  return entries.sort((a, b) => {
    if (a.turns !== b.turns) {
      return a.turns - b.turns; // Sort by turns first
    }
    return a.timeSeconds - b.timeSeconds; // Then sort by time
  })
}

function calculateGuessResult(
  guessWord: string,
  targetWord: string
): LetterResult[] {
  const targetLetters = targetWord.split("");

  const initialResults = guessWord.split("").map((letter) => ({
    letter,
    state: "absent" as LetterState,
  }));

  const firstPassResults = initialResults.map((result, index) => {
    if (result.letter === targetLetters[index]) {
      targetLetters[index] = "";
      return { ...result, state: "correct" as LetterState };
    }
    return result;
  });

  return firstPassResults.map((result) => {
    // Skip already correct letters
    if (result.state === "correct") {
      return result;
    }

    const targetIndex = targetLetters.indexOf(result.letter);
    if (targetIndex !== -1) {
      targetLetters[targetIndex] = "";
      return { ...result, state: "present" as LetterState };
    }

    return result;
  });
}

function determineGameStatus(
  guessWord: string,
  targetWord: string,
  attemptNumber: number
): string {
  if (guessWord === targetWord) {
    return "won";
  }

  if (attemptNumber >= 6) {
    return "lost";
  }

  return "active";
}
