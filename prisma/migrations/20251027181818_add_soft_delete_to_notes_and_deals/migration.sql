-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "deleted_at" TIMESTAMP(3);
