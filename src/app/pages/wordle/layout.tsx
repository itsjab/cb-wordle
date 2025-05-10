import { Trophy } from "lucide-react";

import { link } from "@/app/shared/links";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex p-2 justify-between h-10 mb-4 items-center border-b border-b-gray-500">
        <a href={link("/")}>
          <span className="font-fancy font-bold mr-1">C & B Wordle</span>
        </a>
        <a href={link("/leader-board")}>
          <Trophy size={20} className="text-pink-500" />
        </a>
      </header>
      <main className="min-h-svh">{children}</main>
    </>
  );
}
