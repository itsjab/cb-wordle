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

export function ResultDialog({
  status,
  onReset,
}: {
  status: string;
  onReset: () => void;
}) {
  const title =
    status === "won"
      ? "Would you look at that!"
      : "Well, that didn't work out!";
  const description = "Just like Cathi and Brian's vacation in Hawaii";

  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {status !== "won" && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
          <video controls autoPlay playsInline>
            <source src="/videos/free-shavacados.mp4" type="video/mp4" />
          </video>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={onReset} variant="ghost">
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
