import { getRepository, Repository } from 'typeorm';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../entities/User';
import IUserRepository from './models/IUserRepository';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async count(): Promise<number> {
    return this.ormRepository.count();
  }

  public async create({
    name,
    email,
    password,
    role,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      email,
      password,
      role,
    });
    await this.ormRepository.save(user);
    return user;
  }

  public async delete(id: string): Promise<boolean> {
    await this.ormRepository.softDelete(id);
    return true;
  }

  public async find(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id, {
      relations: ['groups'],
    });
    return user;
  }

  public async findAll(
    page?: number,
    size?: number,
  ): Promise<User[]> {
    return this.ormRepository.find({
      take: size || undefined,
      skip: (page && size) ? (page - 1) * size : undefined,
    });
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        email,
      },
      relations: ['groups'],
    });
    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UserRepository;
