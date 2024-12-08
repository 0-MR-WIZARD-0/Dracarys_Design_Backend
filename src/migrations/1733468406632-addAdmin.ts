import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

export class AddAdmin1733468406632 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = process.env.PASSWORD;
    const hashedPassword = await bcrypt.hash(password, 10);

    await queryRunner.query(
      `INSERT INTO "user" (email, password, "isAdmin") VALUES ('dracarys.design.24@gmail.com', '${hashedPassword}', true);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "user" WHERE email = 'dracarys.design.24@gmail.com';`,
    );
  }
}
