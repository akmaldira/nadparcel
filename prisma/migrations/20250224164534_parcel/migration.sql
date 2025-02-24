/*
  Warnings:

  - Added the required column `max_price` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "item" ADD COLUMN     "max_price" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "parcel_to_item" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "parcel_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "parcel_to_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "worker_wage" DOUBLE PRECISION NOT NULL,
    "images" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "cart_id" TEXT,

    CONSTRAINT "parcel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parcel_to_item_parcel_id_item_id_key" ON "parcel_to_item"("parcel_id", "item_id");

-- AddForeignKey
ALTER TABLE "parcel_to_item" ADD CONSTRAINT "parcel_to_item_parcel_id_fkey" FOREIGN KEY ("parcel_id") REFERENCES "parcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcel_to_item" ADD CONSTRAINT "parcel_to_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcel" ADD CONSTRAINT "parcel_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
