import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExerciseTable1710970399720 implements MigrationInterface {
  name = 'CreateExerciseTable1710970399720';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "exercises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "muscle_id" uuid NOT NULL, "info" text, "tutorial_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a521b5cac5648eedc036e17d1bd" UNIQUE ("name"), CONSTRAINT "PK_c4c46f5fa89a58ba7c2d894e3c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercises" ADD CONSTRAINT "FK_91941405cbc1e00392d62f7e8a1" FOREIGN KEY ("muscle_id") REFERENCES "muscles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exercises" DROP CONSTRAINT "FK_91941405cbc1e00392d62f7e8a1"`,
    );
    await queryRunner.query(`DROP TABLE "exercises"`);
  }
}
