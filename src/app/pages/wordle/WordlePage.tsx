import WordleGame from "@/app/components/wordle/game";
import { getJabs, getOrCreateActiveGame } from "./functions";

export async function WordlePage() {
  const game = await getOrCreateActiveGame();
  const jabs = await getJabs();

  const gameData = {
    id: game.id,
    status: game.status,
    jabs,
    wordle: game.wordle,
    guesses: game.guesses.map((guess) => ({
      word: guess.guess,
      result: guess.result as Array<{ letter: string; state: string }>,
    })),
  };

  return <WordleGame gameData={gameData} />;
}
