-- CreateEnum
CREATE TYPE "DealStage" AS ENUM ('Entrada_de_Lead', 'Contacto_Establecido', 'Descubrimiento', 'Propuesta', 'Negociacion', 'Cerrado_Ganado', 'Cerrado_Perdido');

-- CreateTable
CREATE TABLE "Deal" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "stage" "DealStage" NOT NULL,
    "contact_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "loss_reason_id" INTEGER,
    "loss_reason_note" TEXT,
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LossReason" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LossReason_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_loss_reason_id_fkey" FOREIGN KEY ("loss_reason_id") REFERENCES "LossReason"("id") ON DELETE SET NULL ON UPDATE CASCADE;
