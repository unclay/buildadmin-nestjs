/*
  Warnings:

  - The primary key for the `ba_token` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."ba_token" DROP CONSTRAINT "ba_token_pkey",
ALTER COLUMN "token" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "ba_token_pkey" PRIMARY KEY ("token");
