-- CreateTable
CREATE TABLE `Assets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_name` VARCHAR(100) NOT NULL,
    `asset_number` INTEGER NOT NULL,
    `serial_number` VARCHAR(255) NOT NULL,
    `asset_year` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `no_reg` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `History` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_asset` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `avability` BOOLEAN NOT NULL,
    `condition` BOOLEAN NOT NULL,
    `status_unit` VARCHAR(100) NOT NULL,
    `section` VARCHAR(100) NOT NULL,
    `dapartement` VARCHAR(100) NOT NULL,
    `line` VARCHAR(100) NOT NULL,
    `reason` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
