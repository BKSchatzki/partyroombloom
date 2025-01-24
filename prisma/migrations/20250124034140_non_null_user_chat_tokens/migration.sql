/*
  Warnings:

  - Made the column `chatTokens` on table `PRB_Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PRB_Users" ALTER COLUMN "chatTokens" SET NOT NULL;
