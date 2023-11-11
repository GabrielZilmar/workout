import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteDateColumnToUsersTable1699731344605
  implements MigrationInterface
{
  name = 'DeleteDateColumnToUsersTable1699731344605';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`,
    );
  }
}
