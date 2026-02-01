-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('OPEN', 'PENDING', 'RESOLVED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TradeStatus" ADD VALUE 'PROPOSED';
ALTER TYPE "TradeStatus" ADD VALUE 'UNDER_REVIEW';

-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "barterProposal" TEXT,
ADD COLUMN     "buyerFinished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "commitmentProposal" TEXT,
ADD COLUMN     "moneyProposal" DOUBLE PRECISION,
ADD COLUMN     "proposerId" TEXT,
ADD COLUMN     "sellerFinished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "supervisorConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "supervisorNote" TEXT;

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "IssueStatus" NOT NULL DEFAULT 'OPEN',
    "buyerResolved" BOOLEAN NOT NULL DEFAULT false,
    "sellerResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
