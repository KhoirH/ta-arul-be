/*
  Warnings:

  - You are about to drop the column `avability` on the `History` table. All the data in the column will be lost.
  - Added the required column `avability` to the `Assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Assets` ADD COLUMN `avability` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `History` DROP COLUMN `avability`;
