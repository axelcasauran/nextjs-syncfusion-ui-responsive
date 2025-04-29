-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "startDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceDetail" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "isAccepted" BOOLEAN DEFAULT false,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "minutes" INTEGER DEFAULT 0,
    "startDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceDetail" ADD CONSTRAINT "ServiceDetail_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceDetail" ADD CONSTRAINT "ServiceDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
