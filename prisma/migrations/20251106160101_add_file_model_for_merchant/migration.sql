-- CreateEnum
CREATE TYPE "FileKind" AS ENUM ('COMMERCIAL_REG', 'OWNER_ID', 'STORE_IMAGE', 'OTHER');

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "merchantId" TEXT,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "mimeType" TEXT,
    "size" INTEGER,
    "kind" "FileKind",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "File_ownerUserId_idx" ON "File"("ownerUserId");

-- CreateIndex
CREATE INDEX "File_merchantId_idx" ON "File"("merchantId");

-- CreateIndex
CREATE INDEX "File_kind_merchantId_idx" ON "File"("kind", "merchantId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
