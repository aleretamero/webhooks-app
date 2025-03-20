-- CreateTable
CREATE TABLE "webhook_receiveds" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_receiveds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_received_histories" (
    "id" SERIAL NOT NULL,
    "webhook_received_id" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '{}',
    "headers" TEXT NOT NULL DEFAULT '{}',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_received_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webhook_receiveds_name_key" ON "webhook_receiveds"("name");

-- AddForeignKey
ALTER TABLE "webhook_received_histories" ADD CONSTRAINT "webhook_received_histories_webhook_received_id_fkey" FOREIGN KEY ("webhook_received_id") REFERENCES "webhook_receiveds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
