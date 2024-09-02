import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import UserMapper from '~/modules/users/domain/mappers/users.mapper';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { User } from '~/modules/users/entities/user.entity';
import Env from '~/shared/env';

export default class UsersSeeder implements Seeder {
  /**
   * Track seeder execution.
   */
  track = true;

  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.manager.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);

      const adminUser = await UserDomain.create({
        email: Env.adminEmail,
        username: Env.adminUsername,
        password: {
          value: Env.adminPassword,
        },
        isAdmin: true,
        isEmailVerified: true,
      });
      if (adminUser.isLeft()) {
        throw new Error(adminUser.value.message);
      }

      const user = userRepository.create({
        username: adminUser.value.username.value,
        email: adminUser.value.email.value,
        password: adminUser.value.password.value,
        isEmailVerified: true,
        isAdmin: true,
      });
      await userRepository.save(user);
    });
  }
}
