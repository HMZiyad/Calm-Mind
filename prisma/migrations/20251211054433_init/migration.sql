-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "moodBefore" TEXT NOT NULL,
    "moodDetailed" TEXT,
    "moodAfter" TEXT,
    "rating" INTEGER,
    "script" TEXT,
    "type" TEXT NOT NULL
);
