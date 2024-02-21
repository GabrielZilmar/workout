import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeTokenValueUnique1708558631700 implements MigrationInterface {
  name = 'MakeTokenValueUnique1708558631700';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "UQ_6a8ca5961656d13c16c04079dd3" UNIQUE ("token")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "UQ_6a8ca5961656d13c16c04079dd3"`,
    );
  }
}
