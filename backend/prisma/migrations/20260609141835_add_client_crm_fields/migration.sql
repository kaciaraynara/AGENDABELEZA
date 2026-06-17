/*
  Warnings:

  - The values [ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('OWNER', 'PROFESSIONAL', 'SUPER_ADMIN');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'OWNER';
COMMIT;

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "clientTag" TEXT,
ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "lastMessageSentAt" TIMESTAMP(3),
ADD COLUMN     "lastVisitAt" TIMESTAMP(3),
ADD COLUMN     "loyaltyScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noShowCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "commissionPercent" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "costAmount" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "desiredMarginPercent" DECIMAL(65,30) DEFAULT 30,
ADD COLUMN     "finalPrice" DECIMAL(65,30),
ADD COLUMN     "pricingNotes" TEXT,
ADD COLUMN     "suggestedPrice" DECIMAL(65,30);
