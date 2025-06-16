import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExerciseTranslationTable1750094427367
  implements MigrationInterface
{
  name = 'CreateExerciseTranslationTable1750094427367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."exercise_translations_language_enum" AS ENUM('PORTUGUESE', 'SPANISH')`,
    );
    await queryRunner.query(
      `CREATE TABLE "exercise_translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "info" text, "language" "public"."exercise_translations_language_enum" NOT NULL, "exercise_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b7a38564d11b0d295865975b2ec" UNIQUE ("name"), CONSTRAINT "UQ_7217fb585a06ae8ca15aa1be5d0" UNIQUE ("exercise_id", "language"), CONSTRAINT "PK_8030fe778eb392e39f56606df41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercise_translations" ADD CONSTRAINT "FK_4b9c195dd0f61eca14f92dc62dc" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exercise_translations" DROP CONSTRAINT "FK_4b9c195dd0f61eca14f92dc62dc"`,
    );
    await queryRunner.query(`DROP TABLE "exercise_translations"`);
    await queryRunner.query(
      `DROP TYPE "public"."exercise_translations_language_enum"`,
    );
  }
}
