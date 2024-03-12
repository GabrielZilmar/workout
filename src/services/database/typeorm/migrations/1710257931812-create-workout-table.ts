import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkoutTable1710257931812 implements MigrationInterface {
  name = 'CreateWorkoutTable1710257931812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "workouts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "user_id" uuid NOT NULL, "is_private" boolean NOT NULL DEFAULT true, "is_routine" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5b2319bf64a674d40237dbb1697" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "workouts" ADD CONSTRAINT "FK_2df679279a7ac263bcff20c78dd" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workouts" DROP CONSTRAINT "FK_2df679279a7ac263bcff20c78dd"`,
    );
    await queryRunner.query(`DROP TABLE "workouts"`);
  }
}
