-- AlterTable
ALTER TABLE `Task` ADD COLUMN `difficulty` INTEGER NULL,
    ADD COLUMN `requiredSkills` JSON NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `availability` DOUBLE NULL,
    ADD COLUMN `productivity` DOUBLE NULL,
    ADD COLUMN `score` DOUBLE NULL,
    ADD COLUMN `skills` JSON NULL;
