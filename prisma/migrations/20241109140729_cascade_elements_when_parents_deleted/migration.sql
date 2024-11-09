-- DropForeignKey
ALTER TABLE "PRB_Elements" DROP CONSTRAINT "PRB_Elements_parentId_fkey";

-- AddForeignKey
ALTER TABLE "PRB_Elements" ADD CONSTRAINT "PRB_Elements_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PRB_Elements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
