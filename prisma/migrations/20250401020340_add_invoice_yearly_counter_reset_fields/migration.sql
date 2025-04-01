-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "autoResetYearly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastResetYear" INTEGER;
