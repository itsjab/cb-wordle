import { RequestInfo } from "rwsdk/worker";
import { WordlePage } from "@/app/pages/wordle/WordlePage";

export function Home(requestInfo: RequestInfo) {
  return <WordlePage {...requestInfo} />;
}
