/*
  Warnings:

  - Made the column `product_id` on table `bundle_products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `bundle_products` DROP FOREIGN KEY `bundle_products_product_id_fkey`;

-- AlterTable
ALTER TABLE `bundle_products` ADD COLUMN `code` VARCHAR(55) NULL,
    ADD COLUMN `storage_type` VARCHAR(55) NULL,
    MODIFY `product_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `code` VARCHAR(55) NULL,
    ADD COLUMN `storage_type` VARCHAR(55) NULL;

-- AddForeignKey
ALTER TABLE `bundle_products` ADD CONSTRAINT `bundle_products_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
