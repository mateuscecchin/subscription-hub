/*
  Warnings:

  - Added the required column `durationInHours` to the `plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "durationInHours" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "planEndAt" TIMESTAMP(3),
ADD COLUMN     "planStartAt" TIMESTAMP(3);
