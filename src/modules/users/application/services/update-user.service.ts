import { UpdateUserDto } from '@modules/users/domain/dto/update-user.dto';
import { IUsersRepository } from '@modules/users/domain/interfaces/user-repository.interface';
import { ConflictError } from '@shared/errors/conflict.error';
import { cleanAssign } from '@shared/helpers/clean-assign.helper';
import { NotFoundError } from 'routing-controllers';
import { inject, injectable } from 'tsyringe';
import { deepClone } from '@shared/helpers/deep-clone.helper';
import { IHashProvider } from '../../domain/interfaces/hash-provider.interface';
import { User } from '../../infra/persistence/typeorm/entities/user.entity';

@injectable()
export class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute(id: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const data = deepClone(updateData);

    if (data.email !== user.email && data.email) {
      await this.checkUserExistsByEmail(data.email);
    }

    // TODO: we need separate this to a specific method, it needs more requirements to be changed
    if (data.password) {
      data.password = await this.hashProvider.generateHash(data.password);
    }

    cleanAssign(user, data);

    return this.usersRepository.save(user);
  }

  /**
   * Throws conflict error if an user with the same email aready exists
   * @param email
   */
  private async checkUserExistsByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (user) {
      throw new ConflictError(
        `An user with the same email ${email} already exists.`,
      );
    }
  }
}
