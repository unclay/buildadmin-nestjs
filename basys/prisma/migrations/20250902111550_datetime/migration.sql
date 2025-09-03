/*
  Warnings:

  - The `update_time` column on the `ba_admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `create_time` column on the `ba_admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `update_time` column on the `ba_admin_group` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `create_time` column on the `ba_admin_group` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `create_time` column on the `ba_admin_log` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `update_time` column on the `ba_admin_rule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `create_time` column on the `ba_admin_rule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `create_time` column on the `ba_token` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `expire_time` column on the `ba_token` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."ba_admin" DROP COLUMN "update_time",
ADD COLUMN     "update_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "create_time",
ADD COLUMN     "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "last_login_time",
ADD COLUMN     "last_login_time" TIMESTAMP(3);


-- AlterTable
ALTER TABLE "public"."ba_admin_group" DROP COLUMN "update_time",
ADD COLUMN     "update_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "create_time",
ADD COLUMN     "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."ba_admin_log" DROP COLUMN "create_time",
ADD COLUMN     "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."ba_admin_rule" DROP COLUMN "update_time",
ADD COLUMN     "update_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "create_time",
ADD COLUMN     "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."ba_token" DROP COLUMN "create_time",
ADD COLUMN     "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "expire_time",
ADD COLUMN     "expire_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
