/*
  Warnings:

  - You are about to drop the `Version` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Version";

-- CreateTable
CREATE TABLE "version" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outdatedAt" TIMESTAMP(3),
    "version" TEXT NOT NULL,

    CONSTRAINT "version_pkey" PRIMARY KEY ("id")
);
