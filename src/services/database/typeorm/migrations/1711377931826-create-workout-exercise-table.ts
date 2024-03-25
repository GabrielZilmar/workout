import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkoutExerciseTable1711377931826
  implements MigrationInterface
{
  name = 'CreateWorkoutExerciseTable1711377931826';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "workout-exercises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workout_id" uuid NOT NULL, "exercise_id" uuid NOT NULL, "order" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bc695d4fc1a633e4f210ea8fd48" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "workout-exercises" ADD CONSTRAINT "FK_d2aa405299277bea0da8a73367d" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workout-exercises" ADD CONSTRAINT "FK_0913dee63ee2dcad70bfac6dc38" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workout-exercises" DROP CONSTRAINT "FK_0913dee63ee2dcad70bfac6dc38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workout-exercises" DROP CONSTRAINT "FK_d2aa405299277bea0da8a73367d"`,
    );
    await queryRunner.query(`DROP TABLE "workout-exercises"`);
  }
}
