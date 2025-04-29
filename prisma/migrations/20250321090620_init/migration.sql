-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "SystemNotificationType" AS ENUM ('SYSTEM', 'ACTION', 'INFO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "country" TEXT,
    "timezone" TEXT,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "roleId" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'INACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSignInAt" TIMESTAMP(3),
    "emailVerifiedAt" TIMESTAMP(3),
    "isTrashed" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT,
    "invitedByUserId" TEXT,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,
    "mobilenumber" TEXT,
    "gender" TEXT,
    "qrCode" TEXT,
    "journey" TEXT,
    "tempId" TEXT,
    "departmentId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "addressLine2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "SystemLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entityId" TEXT,
    "entityType" TEXT,
    "event" TEXT,
    "description" TEXT,
    "ipAddress" TEXT,
    "meta" TEXT,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Kids Church',
    "logo" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "address" TEXT,
    "websiteURL" TEXT,
    "supportEmail" TEXT,
    "supportPhone" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "currencyFormat" TEXT NOT NULL DEFAULT '$ {value}',
    "socialFacebook" TEXT,
    "socialTwitter" TEXT,
    "socialInstagram" TEXT,
    "socialLinkedIn" TEXT,
    "socialPinterest" TEXT,
    "socialYoutube" TEXT,
    "notifyStockEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifyStockWeb" BOOLEAN NOT NULL DEFAULT true,
    "notifyStockThreshold" INTEGER NOT NULL DEFAULT 10,
    "notifyStockRoleIds" TEXT[],
    "notifyNewOrderEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifyNewOrderWeb" BOOLEAN NOT NULL DEFAULT true,
    "notifyNewOrderRoleIds" TEXT[],
    "notifyOrderStatusUpdateEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifyOrderStatusUpdateWeb" BOOLEAN NOT NULL DEFAULT true,
    "notifyOrderStatusUpdateRoleIds" TEXT[],
    "notifyPaymentFailureEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifyPaymentFailureWeb" BOOLEAN NOT NULL DEFAULT true,
    "notifyPaymentFailureRoleIds" TEXT[],
    "notifySystemErrorFailureEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifySystemErrorWeb" BOOLEAN NOT NULL DEFAULT true,
    "notifySystemErrorRoleIds" TEXT[],

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemNotification" (
    "id" TEXT NOT NULL,
    "type" "SystemNotificationType" NOT NULL DEFAULT 'SYSTEM',
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT,
    "entityId" TEXT,
    "entityType" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kid" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "fatherId" TEXT,
    "motherId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT,

    CONSTRAINT "Kid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "kidId" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "generatedQRCode" TEXT NOT NULL,
    "checkIN" TIMESTAMP(3) NOT NULL,
    "checkOUT" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "registeredBbyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_invitedByUserId_idx" ON "User"("invitedByUserId");

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- CreateIndex
CREATE INDEX "User_departmentId_idx" ON "User"("departmentId");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_slug_key" ON "UserRole"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_name_key" ON "UserRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_slug_key" ON "UserPermission"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserRolePermission_roleId_permissionId_key" ON "UserRolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "UserAddress_userId_idx" ON "UserAddress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "SystemLog_userId_idx" ON "SystemLog"("userId");

-- CreateIndex
CREATE INDEX "SystemNotification_createdByUserId_idx" ON "SystemNotification"("createdByUserId");

-- CreateIndex
CREATE INDEX "Kid_createdByUserId_idx" ON "Kid"("createdByUserId");

-- CreateIndex
CREATE INDEX "Attendance_createdByUserId_idx" ON "Attendance"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_slug_key" ON "Department"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "UserRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRolePermission" ADD CONSTRAINT "UserRolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "UserRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRolePermission" ADD CONSTRAINT "UserRolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "UserPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "SystemLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemNotification" ADD CONSTRAINT "SystemNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kid" ADD CONSTRAINT "Kid_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
