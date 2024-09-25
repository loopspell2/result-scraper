-- CreateTable
CREATE TABLE "Result" (
    "rollNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cgpa" DOUBLE PRECISION NOT NULL,
    "resultDes" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EnrollmentNo" (
    "rollNo" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "picked" BOOLEAN NOT NULL,
    "notFound" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Result_rollNo_key" ON "Result"("rollNo");

-- CreateIndex
CREATE UNIQUE INDEX "EnrollmentNo_rollNo_key" ON "EnrollmentNo"("rollNo");
