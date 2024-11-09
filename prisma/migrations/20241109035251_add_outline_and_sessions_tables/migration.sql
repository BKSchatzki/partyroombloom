-- CreateTable
CREATE TABLE "PRB_Outlines" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "comments" TEXT NOT NULL,

    CONSTRAINT "PRB_Outlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRB_Elements" (
    "id" TEXT NOT NULL,
    "outlineId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "parentId" TEXT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rollableSuccess" TEXT NOT NULL,
    "rollableFailure" TEXT NOT NULL,

    CONSTRAINT "PRB_Elements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PRB_Outlines" ADD CONSTRAINT "PRB_Outlines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "PRB_Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRB_Elements" ADD CONSTRAINT "PRB_Elements_outlineId_fkey" FOREIGN KEY ("outlineId") REFERENCES "PRB_Outlines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRB_Elements" ADD CONSTRAINT "PRB_Elements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "PRB_Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRB_Elements" ADD CONSTRAINT "PRB_Elements_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PRB_Elements"("id") ON DELETE SET NULL ON UPDATE CASCADE;
