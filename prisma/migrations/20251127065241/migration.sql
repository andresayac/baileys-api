-- CreateTable
CREATE TABLE `Session` (
    `pkId` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` VARCHAR(191) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `data` LONGTEXT NOT NULL,

    INDEX `Session_sessionId_idx`(`sessionId`),
    UNIQUE INDEX `unique_id_per_session_id_1`(`sessionId`, `id`),
    PRIMARY KEY (`pkId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chat` (
    `pkId` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` VARCHAR(191) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `conversationTimestamp` BIGINT NULL,
    `unreadCount` INTEGER NULL,
    `readOnly` BOOLEAN NULL DEFAULT false,
    `endOfHistoryTransfer` BOOLEAN NULL DEFAULT false,
    `ephemeralExpiration` INTEGER NULL,
    `ephemeralSettingTimestamp` BIGINT NULL,
    `disappearingMode` VARCHAR(191) NULL,
    `lastMsgTimestamp` BIGINT NULL,
    `name` VARCHAR(191) NULL,
    `notSpam` BOOLEAN NULL DEFAULT false,
    `archived` BOOLEAN NULL DEFAULT false,
    `pinned` INTEGER NULL,
    `muteEndTime` BIGINT NULL,
    `lastUpdated` BIGINT NULL,

    INDEX `Chat_sessionId_idx`(`sessionId`),
    UNIQUE INDEX `unique_id_per_session_id_2`(`sessionId`, `id`),
    PRIMARY KEY (`pkId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `pkId` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` VARCHAR(191) NOT NULL,
    `remoteJid` VARCHAR(191) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `agentId` VARCHAR(191) NULL,
    `chatId` VARCHAR(191) NULL,
    `fromMe` BOOLEAN NULL,
    `pushName` VARCHAR(191) NULL,
    `broadcast` BOOLEAN NULL,
    `message` JSON NULL,
    `messageType` VARCHAR(191) NULL,
    `messageTimestamp` BIGINT NULL,
    `participant` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `reaction` VARCHAR(191) NULL,

    INDEX `Message_sessionId_idx`(`sessionId`),
    UNIQUE INDEX `Message_sessionId_remoteJid_id_key`(`sessionId`, `remoteJid`, `id`),
    PRIMARY KEY (`pkId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `pkId` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` VARCHAR(191) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `notify` VARCHAR(191) NULL,
    `verifiedName` VARCHAR(191) NULL,
    `imgUrl` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,

    INDEX `Contact_sessionId_idx`(`sessionId`),
    UNIQUE INDEX `unique_id_per_session_id_3`(`sessionId`, `id`),
    PRIMARY KEY (`pkId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
