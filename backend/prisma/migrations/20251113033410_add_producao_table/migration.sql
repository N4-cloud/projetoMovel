-- CreateTable
CREATE TABLE "Producao" (
    "id" TEXT NOT NULL,
    "nomeProduto" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "dataProducao" TEXT NOT NULL,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producao_pkey" PRIMARY KEY ("id")
);
