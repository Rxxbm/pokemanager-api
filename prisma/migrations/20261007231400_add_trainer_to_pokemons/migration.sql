-- AlterTable
ALTER TABLE "pokemons" ADD COLUMN     "trainer_id" UUID;

-- AddForeignKey
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
