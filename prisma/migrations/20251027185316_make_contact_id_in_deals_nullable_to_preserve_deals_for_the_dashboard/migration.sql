-- DropForeignKey
ALTER TABLE "public"."Deal" DROP CONSTRAINT "Deal_contact_id_fkey";

-- AlterTable
ALTER TABLE "Deal" ALTER COLUMN "contact_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
