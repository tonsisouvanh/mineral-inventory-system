/*
  Warnings:

  - Made the column `product_number` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `product_stocks` MODIFY `movement_type` ENUM('IN', 'OUT', 'TRANSFER', 'UNSPECIFIED') NOT NULL DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE `products` MODIFY `product_number` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `bundle_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(18, 0) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `pack` INTEGER NOT NULL DEFAULT 1,
    `images` TEXT NULL,
    `product_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bundle_products` ADD CONSTRAINT `bundle_products_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
