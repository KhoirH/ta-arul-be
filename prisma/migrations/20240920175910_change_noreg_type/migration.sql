/*
  Warnings:

  - Made the column `no_reg` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Employee` MODIFY `no_reg` VARCHAR(255) NOT NULL;
