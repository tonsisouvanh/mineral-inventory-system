/*
  Warnings:

  - You are about to drop the column `updated_at` on the `error_logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `error_logs` DROP COLUMN `updated_at`,
    MODIFY `stackTrace` LONGTEXT NULL;
