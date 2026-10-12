-- CreateTable
CREATE TABLE "captures" (
    "id" UUID NOT NULL,
    "trainer_id" UUID NOT NULL,
    "pokedex_number" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "types" VARCHAR(20)[],
    "image_url" VARCHAR(500),
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "captured_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "captures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "captures_trainer_id_active_idx" ON "captures"("trainer_id", "active");

-- AddForeignKey
ALTER TABLE "captures" ADD CONSTRAINT "captures_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
