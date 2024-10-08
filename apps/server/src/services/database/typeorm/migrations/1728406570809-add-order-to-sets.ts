import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderToSets1728406570809 implements MigrationInterface {
  name = 'AddOrderToSets1728406570809';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sets" ADD "order" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sets" DROP COLUMN "order"`);
  }
}
