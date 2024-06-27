-- CreateTable
CREATE TABLE `User` (
    `id` CHAR(36) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('Guest', 'Admin', 'Student', 'Teacher') NOT NULL DEFAULT 'Guest',
    `token` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentRegister` (
    `id` CHAR(36) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teacher` (
    `id` CHAR(36) NOT NULL,
    `fullName` VARCHAR(255) NOT NULL,
    `NIP` VARCHAR(255) NOT NULL,
    `position` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `subjects` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ekskul` (
    `id` CHAR(36) NOT NULL,
    `extraName` VARCHAR(255) NOT NULL,
    `catagory` VARCHAR(255) NOT NULL,
    `shortDesc` TEXT NOT NULL,
    `fullDesc` LONGTEXT NOT NULL,
    `meetingDays` TEXT NOT NULL,
    `coach` VARCHAR(225) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `contactInfo` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` CHAR(36) NOT NULL,
    `imageName` VARCHAR(255) NOT NULL,
    `imageUrl` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `teacherId` VARCHAR(191) NULL,
    `ekskulId` VARCHAR(191) NOT NULL,

    INDEX `Image_userId_idx`(`userId`),
    INDEX `Image_teacherId_idx`(`teacherId`),
    INDEX `Image_ekskulId_idx`(`ekskulId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentRegister` ADD CONSTRAINT `StudentRegister_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_ekskulId_fkey` FOREIGN KEY (`ekskulId`) REFERENCES `Ekskul`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
