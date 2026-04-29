CREATE TABLE "UserContext" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "name" TEXT,
  "gender" TEXT,
  "dob" TIMESTAMP(3),
  "birthHour" INTEGER,
  "cungMenh" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "UserContext_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatSession" (
  "id" TEXT NOT NULL,
  "userContextId" TEXT,
  "topic" TEXT,
  "astrologyData" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatMessage" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ChatSession"
  ADD CONSTRAINT "ChatSession_userContextId_fkey"
  FOREIGN KEY ("userContextId") REFERENCES "UserContext"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ChatMessage"
  ADD CONSTRAINT "ChatMessage_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
