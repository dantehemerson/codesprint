import { CreateUserDto } from '@modules/users/domain/dto/create-user.dto';
import { IUsersRepository } from '@modules/users/domain/interfaces/user-repository.interface';
import { User } from '@modules/users/infra/persistence/typeorm/entities/user.entity';
import faker from 'faker';
import { deepClone } from '@shared/helpers/deep-clone.helper';

type Optional<T> = T | undefined;

export class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<Optional<User>> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<Optional<User>> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findByUsername(username: string): Promise<Optional<User>> {
    const findUser = this.users.find(user => user.username === username);

    return findUser;
  }

  public async findByEmailAndReturnPassword(
    email: string,
  ): Promise<Optional<User>> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async create(userData: CreateUserDto): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: faker.random.uuid(),
      name: userData.name,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.save(user);

    return user;
  }

  public async deleteById(id: string): Promise<void> {
    this.users = this.users.filter(user => user.id !== id);
  }

  public async save(saveUser: User): Promise<User> {
    const user = deepClone(saveUser);
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);

    if (userIndex !== -1) {
      /** Hack to not break the test when update is executed inmediatly after create.
       * In real cases this should not happen
       */
      user.updated_at = new Date(new Date().getTime() + 1); // update the updated_at date
      this.users[userIndex] = user;
    } else {
      this.users.push(user);
    }
    return user;
  }
}
