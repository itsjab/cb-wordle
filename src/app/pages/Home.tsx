import { WordlePage } from "@/app/pages/wordle/WordlePage";

import { Toaster } from "@/app/components/ui/sonner";

export function Home() {
  return (
    <main>
      <h1>C & B</h1>
      <WordlePage />;
      <Toaster position="top-center" />
    </main>
  );
}
