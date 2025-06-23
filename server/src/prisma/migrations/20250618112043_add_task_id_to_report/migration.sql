/*
  Warnings:

  - Added the required column `taskId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Report` ADD COLUMN `taskId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
