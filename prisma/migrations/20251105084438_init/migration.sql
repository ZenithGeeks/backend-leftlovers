/*
  Warnings:

  - You are about to drop the column `label` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `mobileNumber` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `StoreImageUrl` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `listImageUrl` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `priceDelta` on the `OrderItemOption` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Warning` table. All the data in the column will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Device` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OptionGroupMenu` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `OptionGroup` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pickupCode` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pickupDeadline` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `providerChargeId` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `dob` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `complaintId` on table `Warning` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_actorUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Complaint" DROP CONSTRAINT "Complaint_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Complaint" DROP CONSTRAINT "Complaint_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Device" DROP CONSTRAINT "Device_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Employee" DROP CONSTRAINT "Employee_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Merchant" DROP CONSTRAINT "Merchant_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Merchant" DROP CONSTRAINT "Merchant_ownerUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_menuItemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Warning" DROP CONSTRAINT "Warning_complaintId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_OptionGroupMenu" DROP CONSTRAINT "_OptionGroupMenu_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_OptionGroupMenu" DROP CONSTRAINT "_OptionGroupMenu_B_fkey";

-- DropIndex
DROP INDEX "public"."Address_userId_idx";

-- DropIndex
DROP INDEX "public"."Complaint_customerId_status_idx";

-- DropIndex
DROP INDEX "public"."Employee_username_key";

-- DropIndex
DROP INDEX "public"."Review_customerId_idx";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "label",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "customerId";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "email",
DROP COLUMN "fullName",
DROP COLUMN "mobileNumber",
DROP COLUMN "username",
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MenuItem" ALTER COLUMN "expireLabelUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "StoreImageUrl",
DROP COLUMN "listImageUrl",
ADD COLUMN     "branchName" TEXT;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "pickupCode" SET NOT NULL,
ALTER COLUMN "pickupDeadline" SET NOT NULL;

-- AlterTable
ALTER TABLE "OrderItemOption" DROP COLUMN "priceDelta";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "providerChargeId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "customerId",
DROP COLUMN "tags";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Warning" DROP COLUMN "expiresAt",
ALTER COLUMN "complaintId" SET NOT NULL;

-- DropTable
DROP TABLE "public"."AuditLog";

-- DropTable
DROP TABLE "public"."Device";

-- DropTable
DROP TABLE "public"."_OptionGroupMenu";

-- CreateTable
CREATE TABLE "Favorite" (
    "userId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("userId","merchantId")
);

-- CreateTable
CREATE TABLE "_MenuItemToOptionGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MenuItemToOptionGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MenuItemToOptionGroup_B_index" ON "_MenuItemToOptionGroup"("B");

-- CreateIndex
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex
CREATE INDEX "MenuItem_merchantId_idx" ON "MenuItem"("merchantId");

-- CreateIndex
CREATE UNIQUE INDEX "OptionGroup_name_key" ON "OptionGroup"("name");

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warning" ADD CONSTRAINT "Warning_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuItemToOptionGroup" ADD CONSTRAINT "_MenuItemToOptionGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuItemToOptionGroup" ADD CONSTRAINT "_MenuItemToOptionGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "OptionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
