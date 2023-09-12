import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1693935575636 implements MigrationInterface {
  name = 'CreateUsersTable1693935575636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sso_id" uuid NOT NULL, "user_name" character varying NOT NULL, "age" integer NOT NULL, "weight" integer NOT NULL, "height" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
