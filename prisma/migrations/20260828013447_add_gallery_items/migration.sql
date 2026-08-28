-- CreateEnum
CREATE TYPE "GalleryMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL,
    "type" "GalleryMediaType" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "posterUrl" TEXT,
    "caption" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'uncategorised',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GalleryItem_objectKey_key" ON "GalleryItem"("objectKey");

-- CreateIndex
CREATE INDEX "GalleryItem_isPublished_category_idx" ON "GalleryItem"("isPublished", "category");

-- AddForeignKey
ALTER TABLE "GalleryItem" ADD CONSTRAINT "GalleryItem_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
