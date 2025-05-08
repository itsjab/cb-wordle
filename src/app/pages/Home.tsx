import { RequestInfo } from "rwsdk/worker";
import WordleGame from "@/app/components/wordle/game";

export function Home({ ctx }: RequestInfo) {
  return (
    <main>
      <WordleGame />
    </main>
  );
}
