-- AlterTable
ALTER TABLE `products` ADD COLUMN `remarks` TEXT NULL;

-- AlterTable
ALTER TABLE `refresh_tokens` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
