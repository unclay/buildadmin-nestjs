-- CreateTable
CREATE TABLE "public"."ba_token" (
    "token" VARCHAR(50) NOT NULL DEFAULT '',
    "type" VARCHAR(15) NOT NULL DEFAULT '',
    "user_id" INTEGER NOT NULL DEFAULT 0,
    "create_time" BIGINT,
    "expire_time" BIGINT,

    CONSTRAINT "ba_token_pkey" PRIMARY KEY ("token")
);
