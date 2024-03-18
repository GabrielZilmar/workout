import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMuscleTable1710698636556 implements MigrationInterface {
  name = 'CreateMuscleTable1710698636556';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "muscles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_045c55b12f366cadd2ad0e363fc" UNIQUE ("name"), CONSTRAINT "PK_d447d24f0750ae71b1ec5ae9668" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "muscles"`);
  }
}
