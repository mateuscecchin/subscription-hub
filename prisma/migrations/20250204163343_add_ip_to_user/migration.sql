/*
  Warnings:

  - A unique constraint covering the columns `[coupon]` on the table `plan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coupon` to the `plan` table without a default value. This is not possible if the table is not empty.
  - Made the column `ip` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "history" ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "status" TEXT DEFAULT 'pending';

-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "coupon" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "ip" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "plan_coupon_key" ON "plan"("coupon");
