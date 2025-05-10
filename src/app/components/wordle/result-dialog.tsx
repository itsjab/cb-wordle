import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

import { Button } from "@/app/components/ui/button";

import { link } from "@/app/shared/links";
import { GameData } from "./game";

const results = [
  {
    attempts: 1,
    title: "Suspicious 🧐",
    description: "Have you been stalking Cathi & Brian?",
    video: "/videos/just-look-at-it.mp4",
  },
  {
    attempts: 2,
    title: "Would you look at that 🤩",
    description: "Have you been stalking Cathi & Brian?",
    video: "/videos/just-look-at-it.mp4",
  },
  {
    attempts: 3,
    title: "Whoop Whopp! 🎉",
    description:
      "And the „Who knows Cathi & Brian of the year award“ goes to...",
    video: "/videos/just-look-at-it.mp4",
  },
  {
    attempts: 4,
    title: "Solid effort 👏",
    description: "Here are some free shavacados for you.",
    video: "/videos/free-shavacados.mp4",
  },
  {
    attempts: 5,
    title: "Oh la la 😮‍💨",
    description:
      "Living life on the edge, just like Cathi & Brian with their wedding planning.",
    video: "/videos/free-shavacados.mp4",
  },
  {
    attempts: 6,
    title: "Oh la la 😮‍💨",
    description:
      "Living life on the edge, just like Cathi & Brian with their wedding planning.",
    video: "/videos/free-shavacados.mp4",
  },
];

function getResult(gameData: GameData) {
  const fallback = {
    title: "Well, that didn't work out!",
    description: "Here are some free shavacados for you.",
    video: "/videos/free-shavacados.mp4",
  };

  if (gameData.status !== "won") {
    return fallback;
  }

  const attempts = gameData.guesses.length;
  const result = results.find((result) => result.attempts === attempts);

  return result || fallback;
}

export function ResultDialog({
  onReset,
  gameData,
}: {
  onReset: () => void;
  gameData: GameData;
}) {
  const { title, description, video } = getResult(gameData);

  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          {gameData.status === "won" && (
            <>
              <div>
                <p className="text-sm text-muted-foreground">
                  You guessed the word in {gameData.guesses.length} attempts.
                </p>
                <p className="text-sm text-muted-foreground">
                  The word was{" "}
                  <span className="font-bold">{gameData.guesses[0].word}</span>.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Here is a little something for you:
              </p>
            </>
          )}
          <video controls autoPlay playsInline>
            <source src={video} type="video/mp4" />
          </video>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={onReset} variant="outline">
              Play again
            </Button>
          </AlertDialogAction>
          <AlertDialogAction asChild>
            <a href={link("/leader-board")}>View leader board</a>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
