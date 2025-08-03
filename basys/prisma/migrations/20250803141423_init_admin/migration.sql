-- CreateEnum
CREATE TYPE "public"."AdminStatus" AS ENUM ('enable', 'disable');

-- CreateEnum
CREATE TYPE "public"."RuleType" AS ENUM ('menu_dir', 'menu', 'button');

-- CreateEnum
CREATE TYPE "public"."MenuType" AS ENUM ('tab', 'link', 'iframe');

-- CreateEnum
CREATE TYPE "public"."ExtendType" AS ENUM ('none', 'add_rules_only', 'add_menu_only');

-- CreateTable
CREATE TABLE "public"."ba_admin" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "nickname" VARCHAR(50) NOT NULL DEFAULT '',
    "avatar" VARCHAR(255) NOT NULL DEFAULT '',
    "email" VARCHAR(50) NOT NULL DEFAULT '',
    "mobile" VARCHAR(11) NOT NULL DEFAULT '',
    "login_failure" INTEGER NOT NULL DEFAULT 0,
    "last_login_time" BIGINT,
    "last_login_ip" VARCHAR(50) NOT NULL DEFAULT '',
    "password" VARCHAR(255) NOT NULL DEFAULT '',
    "salt" VARCHAR(30) NOT NULL DEFAULT '',
    "motto" VARCHAR(255) NOT NULL DEFAULT '',
    "status" "public"."AdminStatus" NOT NULL DEFAULT 'enable',
    "update_time" BIGINT,
    "create_time" BIGINT,

    CONSTRAINT "ba_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ba_admin_group" (
    "id" SERIAL NOT NULL,
    "pid" INTEGER NOT NULL DEFAULT 0,
    "name" VARCHAR(100) NOT NULL DEFAULT '',
    "rules" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "update_time" BIGINT,
    "create_time" BIGINT,

    CONSTRAINT "ba_admin_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ba_admin_group_access" (
    "uid" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "ba_admin_group_access_pkey" PRIMARY KEY ("uid","group_id")
);

-- CreateTable
CREATE TABLE "public"."ba_admin_log" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL DEFAULT 0,
    "username" VARCHAR(20) NOT NULL DEFAULT '',
    "url" VARCHAR(1500) NOT NULL DEFAULT '',
    "title" VARCHAR(100) NOT NULL DEFAULT '',
    "data" TEXT,
    "ip" VARCHAR(50) NOT NULL DEFAULT '',
    "useragent" VARCHAR(255) NOT NULL DEFAULT '',
    "create_time" BIGINT,

    CONSTRAINT "ba_admin_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ba_admin_rule" (
    "id" SERIAL NOT NULL,
    "pid" INTEGER NOT NULL DEFAULT 0,
    "type" "public"."RuleType" NOT NULL DEFAULT 'menu',
    "title" VARCHAR(50) NOT NULL DEFAULT '',
    "name" VARCHAR(50) NOT NULL DEFAULT '',
    "path" VARCHAR(100) NOT NULL DEFAULT '',
    "icon" VARCHAR(50) NOT NULL DEFAULT '',
    "menu_type" "public"."MenuType",
    "url" VARCHAR(255) NOT NULL DEFAULT '',
    "component" VARCHAR(100) NOT NULL DEFAULT '',
    "keepalive" INTEGER NOT NULL DEFAULT 0,
    "extend" "public"."ExtendType" NOT NULL DEFAULT 'none',
    "remark" VARCHAR(255) NOT NULL DEFAULT '',
    "weigh" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "update_time" BIGINT,
    "create_time" BIGINT,

    CONSTRAINT "ba_admin_rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ba_admin_username_key" ON "public"."ba_admin"("username");

-- CreateIndex
CREATE INDEX "ba_admin_group_access_uid_idx" ON "public"."ba_admin_group_access"("uid");

-- CreateIndex
CREATE INDEX "ba_admin_group_access_group_id_idx" ON "public"."ba_admin_group_access"("group_id");

-- CreateIndex
CREATE INDEX "ba_admin_rule_pid_idx" ON "public"."ba_admin_rule"("pid");

-- AddForeignKey
ALTER TABLE "public"."ba_admin_group_access" ADD CONSTRAINT "ba_admin_group_access_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."ba_admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ba_admin_group_access" ADD CONSTRAINT "ba_admin_group_access_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."ba_admin_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ba_admin_log" ADD CONSTRAINT "ba_admin_log_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."ba_admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
