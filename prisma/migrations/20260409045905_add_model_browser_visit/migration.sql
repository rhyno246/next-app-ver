-- CreateTable
CREATE TABLE "BrowserVisit" (
    "id" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrowserVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrowserVisit_browser_key" ON "BrowserVisit"("browser");
