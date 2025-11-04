/*
  Warnings:

  - You are about to drop the column `menuId` on the `OptionGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."OptionGroup" DROP CONSTRAINT "OptionGroup_menuId_fkey";

-- DropIndex
DROP INDEX "public"."OptionGroup_menuId_idx";

-- AlterTable
ALTER TABLE "OptionGroup" DROP COLUMN "menuId";

-- CreateTable
CREATE TABLE "_OptionGroupMenu" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OptionGroupMenu_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OptionGroupMenu_B_index" ON "_OptionGroupMenu"("B");

-- AddForeignKey
ALTER TABLE "_OptionGroupMenu" ADD CONSTRAINT "_OptionGroupMenu_A_fkey" FOREIGN KEY ("A") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionGroupMenu" ADD CONSTRAINT "_OptionGroupMenu_B_fkey" FOREIGN KEY ("B") REFERENCES "OptionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
