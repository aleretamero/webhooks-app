-- CreateTable
CREATE TABLE "webhook_received_histories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "webhook_received_id" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '{}',
    "headers" TEXT NOT NULL DEFAULT '{}',
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "webhook_received_histories_webhook_received_id_fkey" FOREIGN KEY ("webhook_received_id") REFERENCES "webhook_receiveds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
