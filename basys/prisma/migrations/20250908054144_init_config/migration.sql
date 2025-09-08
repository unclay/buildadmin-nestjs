-- CreateTable
CREATE TABLE "public"."ba_config" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL DEFAULT '',
    "group" VARCHAR(30) NOT NULL DEFAULT '',
    "title" VARCHAR(50) NOT NULL DEFAULT '',
    "tip" VARCHAR(100) NOT NULL DEFAULT '',
    "type" VARCHAR(30) NOT NULL DEFAULT '',
    "value" TEXT,
    "content" TEXT,
    "rule" VARCHAR(100) NOT NULL DEFAULT '',
    "extend" VARCHAR(255) NOT NULL DEFAULT '',
    "allow_del" SMALLINT NOT NULL DEFAULT 0,
    "weigh" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ba_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ba_config_name_key" ON "public"."ba_config"("name");
