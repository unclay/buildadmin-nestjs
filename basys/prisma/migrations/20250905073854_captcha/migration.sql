-- CreateTable
CREATE TABLE "public"."ba_captcha" (
    "key" VARCHAR(32) NOT NULL,
    "code" VARCHAR(32) NOT NULL DEFAULT '',
    "captcha" TEXT,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ba_captcha_pkey" PRIMARY KEY ("key")
);
