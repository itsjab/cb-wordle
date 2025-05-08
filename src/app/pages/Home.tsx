import { WordlePage } from "@/app/pages/wordle/WordlePage";

import { Toaster } from "@/app/components/ui/sonner";

export function Home() {
  return (
    <main>
      <WordlePage />;
      <Toaster position="top-center" />
    </main>
  );
}
