-- CreateEnum
CREATE TYPE "User_State" AS ENUM ('available', 'unavailable', 'blocked');

-- CreateEnum
CREATE TYPE "User_Role" AS ENUM ('admin', 'wh', 'sale', 'hr', 'other');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "username" STRING NOT NULL,
    "password" STRING NOT NULL,
    "state" "User_State" NOT NULL DEFAULT 'unavailable',
    "role" "User_Role" NOT NULL DEFAULT 'other',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
