/*
  Warnings:

  - You are about to drop the column `status` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `Report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_taskId_fkey`;

-- DropIndex
DROP INDEX `Report_taskId_fkey` ON `Report`;

-- AlterTable
ALTER TABLE `Report` DROP COLUMN `status`,
    DROP COLUMN `taskId`;

-- AlterTable
ALTER TABLE `Task` ADD COLUMN `completedAt` DATETIME(3) NULL,
    MODIFY `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'IN_PROGRESS';
