import WordleGame from "@/app/components/wordle/game";
import { getOrCreateActiveGame } from "./functions";

export async function WordlePage() {
  const game = await getOrCreateActiveGame();

  // Extract game data to pass to the client component
  const gameData = {
    id: game.id,
    status: game.status,
    guesses: game.guesses.map((guess) => ({
      word: guess.guess,
      result: guess.result as Array<{ letter: string; state: string }>,
    })),
  };

  return (
    <main>
      <WordleGame gameData={gameData} />
    </main>
  );
}
