/*
  Warnings:

  - You are about to drop the column `id_user` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `no_reg` on the `Users` table. All the data in the column will be lost.
  - Added the required column `id_employee` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `History` DROP COLUMN `id_user`,
    ADD COLUMN `id_employee` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `name`,
    DROP COLUMN `no_reg`;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_reg` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `function` VARCHAR(255) NOT NULL,
    `section` VARCHAR(255) NOT NULL,
    `line` VARCHAR(255) NOT NULL,
    `dapartement` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
