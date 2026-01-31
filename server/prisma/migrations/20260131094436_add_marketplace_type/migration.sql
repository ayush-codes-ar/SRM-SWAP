-- CreateEnum
CREATE TYPE "MarketplaceType" AS ENUM ('NORMAL', 'FRESHERS');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "marketplace" "MarketplaceType" NOT NULL DEFAULT 'NORMAL';
