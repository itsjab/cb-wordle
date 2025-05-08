"use server";

import { requestInfo } from "rwsdk/worker";
import { db } from "@/db";

type LetterState = "correct" | "present" | "absent";
type LetterResult = { letter: string; state: LetterState };

// Get or create an active game for the current user
export async function getOrCreateActiveGame() {
  const { ctx } = requestInfo;
  
  // Ensure user is authenticated
  if (!ctx.user) {
    throw new Error("User not authenticated");
  }

  // Try to find an active game for the user
  const game = await db.game.findFirst({
    where: { 
      userId: ctx.user.id,
      status: "active" 
    },
    include: {
      guesses: true
    }
  });

  // If active game exists, return it
  if (game) {
    return game;
  }
  
  // Otherwise create a new game
  const words = ["APPLE", "BEACH", "CLOUD", "DANCE", "EARTH", "FLAME", "GRAPE", "HOUSE", "IVORY", "JELLY"];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  
  return db.game.create({
    data: {
      userId: ctx.user.id,
      status: "active",
      wordle: randomWord,
    },
    include: {
      guesses: true
    }
  });
}

// Submit a guess for the current game
export async function submitGuess(gameId: string, guessWord: string) {
  const { ctx } = requestInfo;
  
  // Ensure user is authenticated
  if (!ctx.user) {
    throw new Error("User not authenticated");
  }

  // Validate the guess (must be 5 letters)
  if (guessWord.length !== 5) {
    throw new Error("Guess must be 5 letters");
  }

  // Get the game
  const game = await db.game.findUnique({
    where: { id: gameId },
    include: {
      guesses: {
        orderBy: {
          attempt: "asc"
        }
      }
    }
  });

  // Ensure game exists and belongs to the user
  if (!game) {
    throw new Error("Game not found");
  }
  
  if (game.userId !== ctx.user.id) {
    throw new Error("Not authorized to access this game");
  }

  // Ensure game is active
  if (game.status !== "active") {
    throw new Error("Game is not active");
  }

  // Ensure we haven't reached the maximum number of guesses
  if (game.guesses.length >= 6) {
    throw new Error("Maximum number of guesses reached");
  }

  // Calculate the result of the guess
  const targetWord = game.wordle;
  const result = calculateGuessResult(guessWord, targetWord);

  // Create the guess in the database
  await db.guess.create({
    data: {
      gameId,
      guess: guessWord,
      attempt: game.guesses.length + 1,
      result
    }
  });

  // Determine new game status
  const newStatus = determineGameStatus(guessWord, targetWord, game.guesses.length + 1);
  
  // Update game status if needed
  if (newStatus !== "active") {
    await db.game.update({
      where: { id: gameId },
      data: { status: newStatus }
    });
  }

  // Return updated game
  return db.game.findUnique({
    where: { id: gameId },
    include: {
      guesses: {
        orderBy: {
          attempt: "asc"
        }
      }
    }
  });
}

// Helper function to calculate the result of a guess
function calculateGuessResult(guessWord: string, targetWord: string): LetterResult[] {
  const targetLetters = targetWord.split("");
  
  // Initialize results with all letters marked as absent
  const initialResults = guessWord.split("").map(letter => ({
    letter,
    state: "absent" as LetterState
  }));
  
  // First pass: mark correct letters
  const firstPassResults = initialResults.map((result, index) => {
    if (result.letter === targetLetters[index]) {
      // Mark letter as correct and remove from target
      targetLetters[index] = "";
      return { ...result, state: "correct" as LetterState };
    }
    return result;
  });
  
  // Second pass: mark present letters
  return firstPassResults.map(result => {
    // Skip already correct letters
    if (result.state === "correct") {
      return result;
    }
    
    const targetIndex = targetLetters.indexOf(result.letter);
    if (targetIndex !== -1) {
      // Mark letter as present and remove from target
      targetLetters[targetIndex] = "";
      return { ...result, state: "present" as LetterState };
    }
    
    return result;
  });
}

// Helper function to determine game status
function determineGameStatus(guessWord: string, targetWord: string, attemptNumber: number): string {
  if (guessWord === targetWord) {
    return "won";
  }
  
  if (attemptNumber >= 6) {
    return "lost";
  }
  
  return "active";
}
