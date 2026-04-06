-- CreateTable
CREATE TABLE "AnalystAssignment" (
    "id" TEXT NOT NULL,
    "analystId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalystAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalystAssignment_analystId_idx" ON "AnalystAssignment"("analystId");

-- CreateIndex
CREATE INDEX "AnalystAssignment_userId_idx" ON "AnalystAssignment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AnalystAssignment_analystId_userId_key" ON "AnalystAssignment"("analystId", "userId");

-- AddForeignKey
ALTER TABLE "AnalystAssignment" ADD CONSTRAINT "AnalystAssignment_analystId_fkey" FOREIGN KEY ("analystId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalystAssignment" ADD CONSTRAINT "AnalystAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
