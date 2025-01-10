-- CreateTable
CREATE TABLE "PRB_Conversations" (
    "id" SERIAL NOT NULL,
    "outlineId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "thread" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PRB_Conversations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PRB_Conversations" ADD CONSTRAINT "PRB_Conversations_outlineId_fkey" FOREIGN KEY ("outlineId") REFERENCES "PRB_Outlines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRB_Conversations" ADD CONSTRAINT "PRB_Conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "PRB_Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
