import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupDatabase1725903344163 implements MigrationInterface {
  name = 'SetupDatabase1725903344163';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "muscles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_045c55b12f366cadd2ad0e363fc" UNIQUE ("name"), CONSTRAINT "PK_d447d24f0750ae71b1ec5ae9668" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exercises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "muscle_id" uuid NOT NULL, "info" text, "tutorial_url" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a521b5cac5648eedc036e17d1bd" UNIQUE ("name"), CONSTRAINT "PK_c4c46f5fa89a58ba7c2d894e3c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workout_exercise_id" uuid NOT NULL, "num_reps" integer NOT NULL DEFAULT '0', "weight" integer NOT NULL DEFAULT '0', "num_drops" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5d15ed8b3e2a5cb6e9c9921d056" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "is_email_verified" boolean NOT NULL DEFAULT false, "is_admin" boolean NOT NULL DEFAULT false, "age" integer, "weight" numeric(10,2), "height" numeric(10,2), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "workouts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "user_id" uuid NOT NULL, "is_private" boolean NOT NULL DEFAULT true, "is_routine" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9b3ed8405efac2b46cef0f9939f" UNIQUE ("user_id", "name"), CONSTRAINT "PK_5b2319bf64a674d40237dbb1697" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "workout_exercises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workout_id" uuid NOT NULL, "exercise_id" uuid NOT NULL, "order" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_377f9ead6fd69b29f0d0feb1028" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "type" character varying NOT NULL, "token" character varying NOT NULL, "expiry" TIMESTAMP WITH TIME ZONE NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6a8ca5961656d13c16c04079dd3" UNIQUE ("token"), CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercises" ADD CONSTRAINT "FK_91941405cbc1e00392d62f7e8a1" FOREIGN KEY ("muscle_id") REFERENCES "muscles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sets" ADD CONSTRAINT "FK_31a6f55b3ecb4516de1970f5c94" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout_exercises"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workouts" ADD CONSTRAINT "FK_2df679279a7ac263bcff20c78dd" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workout_exercises" ADD CONSTRAINT "FK_7e6040e931b008308aaddbb7d32" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workout_exercises" ADD CONSTRAINT "FK_9a0656f321d9a96de2eb685e85a" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workout_exercises" DROP CONSTRAINT "FK_9a0656f321d9a96de2eb685e85a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workout_exercises" DROP CONSTRAINT "FK_7e6040e931b008308aaddbb7d32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workouts" DROP CONSTRAINT "FK_2df679279a7ac263bcff20c78dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sets" DROP CONSTRAINT "FK_31a6f55b3ecb4516de1970f5c94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercises" DROP CONSTRAINT "FK_91941405cbc1e00392d62f7e8a1"`,
    );
    await queryRunner.query(`DROP TABLE "tokens"`);
    await queryRunner.query(`DROP TABLE "workout_exercises"`);
    await queryRunner.query(`DROP TABLE "workouts"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "sets"`);
    await queryRunner.query(`DROP TABLE "exercises"`);
    await queryRunner.query(`DROP TABLE "muscles"`);
  }
}
