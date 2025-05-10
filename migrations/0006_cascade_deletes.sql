-- DropTable
PRAGMA foreign_keys=off;
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Credential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "credentialId" TEXT NOT NULL,
    "publicKey" BLOB NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Credential" ("counter", "createdAt", "credentialId", "id", "publicKey", "userId") SELECT "counter", "createdAt", "credentialId", "id", "publicKey", "userId" FROM "Credential";
DROP TABLE "Credential";
ALTER TABLE "new_Credential" RENAME TO "Credential";
CREATE UNIQUE INDEX "Credential_userId_key" ON "Credential"("userId");
CREATE UNIQUE INDEX "Credential_credentialId_key" ON "Credential"("credentialId");
CREATE INDEX "Credential_credentialId_idx" ON "Credential"("credentialId");
CREATE INDEX "Credential_userId_idx" ON "Credential"("userId");
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "wordle" TEXT NOT NULL,
    CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("createdAt", "id", "isArchived", "status", "updatedAt", "userId", "wordle") SELECT "createdAt", "id", "isArchived", "status", "updatedAt", "userId", "wordle" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE TABLE "new_Guess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameId" TEXT NOT NULL,
    "guess" TEXT NOT NULL,
    "attempt" INTEGER NOT NULL,
    "result" JSONB NOT NULL,
    CONSTRAINT "Guess_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Guess" ("attempt", "createdAt", "gameId", "guess", "id", "result") SELECT "attempt", "createdAt", "gameId", "guess", "id", "result" FROM "Guess";
DROP TABLE "Guess";
ALTER TABLE "new_Guess" RENAME TO "Guess";
CREATE INDEX "Guess_gameId_idx" ON "Guess"("gameId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
