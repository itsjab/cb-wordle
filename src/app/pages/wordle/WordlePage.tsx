import WordleGame from "@/app/components/wordle/game";
import { getJabs, getOrCreateActiveGame } from "./functions";

export async function WordlePage() {
  const game = await getOrCreateActiveGame();
  // const jabs = await getJabs();
  const jabs = [
    {
      id: "1",
      headline: "Test 1",
      description: "Test 1 description",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      headline: "Test 2",
      description: "Test 2 description",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const gameData = {
    id: game.id,
    status: game.status,
    jabs,
    guesses: game.guesses.map((guess) => ({
      word: guess.guess,
      result: guess.result as Array<{ letter: string; state: string }>,
    })),
  };

  return <WordleGame gameData={gameData} />;
}
