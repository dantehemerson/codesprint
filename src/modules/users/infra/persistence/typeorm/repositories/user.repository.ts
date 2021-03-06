import { CreateUserDto } from '@modules/users/domain/dto/create-user.dto';
import { IUsersRepository } from '@modules/users/domain/interfaces/user-repository.interface';
import { User } from '@modules/users/infra/persistence/typeorm/entities/user.entity';
import { getRepository, Repository } from 'typeorm';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { username } });

    return user;
  }

  async findByEmailAndReturnPassword(email: string): Promise<User | undefined> {
    const user = await this.ormRepository
      .createQueryBuilder()
      .where({
        email,
      })
      .addSelect('User.password')
      .getOne();

    return user;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const user = await this.ormRepository.create(userData);
    return this.save(user);
  }

  async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }

  async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
