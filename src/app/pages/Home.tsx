import { WordlePage } from "@/app/pages/wordle/WordlePage";

import { Toaster } from "@/app/components/ui/sonner";

import GameLayout from "./wordle/layout";

export function Home() {
  return (
    <>
      <GameLayout>
        <WordlePage />
      </GameLayout>
      <Toaster position="top-center" />
    </>
  );
}
