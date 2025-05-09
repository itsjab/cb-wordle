import { ListOrdered } from "lucide-react";

import { link } from "@/app/shared/links";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex p-2 justify-between h-10 mb-4 bg-pink-400">
        <a href={link("/")}>C&B Wordle</a>
        <a href={link("/leader-board")}>
          <ListOrdered size={24} />
        </a>
      </header>
      <main className="min-h-svh">{children}</main>
    </>
  );
}
