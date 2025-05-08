import { RequestInfo } from "rwsdk/worker";
import { WordlePage } from "@/app/pages/wordle/WordlePage";

export function Home() {
  return (
    <main>
      <h1>C & B</h1>
      <WordlePage />;
    </main>
  );
}
