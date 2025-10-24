-- DropForeignKey
ALTER TABLE "public"."Contact" DROP CONSTRAINT "Contact_company_id_fkey";

-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "company_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
