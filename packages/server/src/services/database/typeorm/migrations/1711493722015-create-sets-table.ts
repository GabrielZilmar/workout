import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSetsTable1711493722015 implements MigrationInterface {
  name = 'CreateSetsTable1711493722015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workout_exercise_id" uuid NOT NULL, "num_reps" integer NOT NULL DEFAULT '0', "weight" integer NOT NULL DEFAULT '0', "num_drops" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5d15ed8b3e2a5cb6e9c9921d056" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sets" ADD CONSTRAINT "FK_31a6f55b3ecb4516de1970f5c94" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout-exercises"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sets" DROP CONSTRAINT "FK_31a6f55b3ecb4516de1970f5c94"`,
    );
    await queryRunner.query(`DROP TABLE "sets"`);
  }
}
