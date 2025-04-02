-- CreateTable
CREATE TABLE "ZipCache" (
    "zip" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZipCache_pkey" PRIMARY KEY ("zip")
);

-- CreateTable
CREATE TABLE "ZipCity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,

    CONSTRAINT "ZipCity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ZipCity_zipCode_idx" ON "ZipCity"("zipCode");

-- AddForeignKey
ALTER TABLE "ZipCity" ADD CONSTRAINT "ZipCity_zipCode_fkey" FOREIGN KEY ("zipCode") REFERENCES "ZipCache"("zip") ON DELETE RESTRICT ON UPDATE CASCADE;
