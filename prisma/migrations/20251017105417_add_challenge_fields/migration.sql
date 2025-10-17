-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "challengeStartTime" TIMESTAMP(3),
ADD COLUMN     "challengeStarted" BOOLEAN NOT NULL DEFAULT false;
