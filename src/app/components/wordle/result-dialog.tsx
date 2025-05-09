import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

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
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <a href={link("/leader-board")}>View leader board</a>
          </AlertDialogAction>
          {/* Remove before wedding */}
          <AlertDialogAction onClick={onReset}>Play again</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
