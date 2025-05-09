import { WordlePage } from "@/app/pages/wordle/WordlePage";

import { Toaster } from "@/app/components/ui/sonner";

export function Home() {
  return (
    <main className="px-2">
      <WordlePage />
      <Toaster position="top-center" />
    </main>
  );
}
