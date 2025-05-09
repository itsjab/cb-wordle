import GameLayout from "./layout";

import { getLeaderboard } from "./functions";

export async function LeaderBoard() {
  const entries = await getLeaderboard();

  return (
    <GameLayout>
      <>
        <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">Rank</th>
                <th className="px-2 py-1 border">Username</th>
                <th className="px-2 py-1 border">Turns</th>
                <th className="px-2 py-1 border">Time (s)</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry: any, i: number) => (
                <tr key={i} className="text-center">
                  <td className="border px-2 py-1">{i + 1}</td>
                  <td className="border px-2 py-1">{entry.username}</td>
                  <td className="border px-2 py-1">
                    {entry.turns !== null ? entry.turns : "—"}
                  </td>
                  <td className="border px-2 py-1">
                    {entry.timeSeconds !== null
                      ? entry.timeSeconds.toFixed(2)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    </GameLayout>
  );
}
