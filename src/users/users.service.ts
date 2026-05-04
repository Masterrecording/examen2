import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from '../enums/role.enum';
import { User } from './user.entity';

interface CreateUserInput {
  nombre: string;
  username: string;
  password: string;
  role: Role;
}

interface UpdateUserInput {
  nombre?: string;
  username?: string;
  password?: string;
  role?: Role;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserInput.username },
    });

    if (existingUser) {
      throw new ConflictException('El username ya existe');
    }

    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    const user = this.usersRepository.create({
      ...createUserInput,
      email: `${createUserInput.username}@local.dev`,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    return this.sanitizeUser(savedUser);
  }

  async findAll(currentUserId: number, currentUserRole: Role) {
    if (currentUserRole === Role.USER) {
      const user = await this.usersRepository.findOne({
        where: { id: currentUserId },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return this.sanitizeUser(user);
    }

    const users = await this.usersRepository.find();
    return users.map((user) => this.sanitizeUser(user));
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (updateUserInput.username && updateUserInput.username !== user.username) {
      const existingUser = await this.usersRepository.findOne({
        where: { username: updateUserInput.username },
      });

      if (existingUser) {
        throw new ConflictException('El username ya existe');
      }
    }

    if (updateUserInput.password) {
      updateUserInput.password = await bcrypt.hash(updateUserInput.password, 10);
    }

    await this.usersRepository.update(id, updateUserInput);

    const updatedUser = await this.usersRepository.findOne({
      where: { id },
    });

    if (!updatedUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.sanitizeUser(updatedUser);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.usersRepository.delete(id);

    return {
      message: 'Usuario eliminado correctamente',
    };
  }

  async makeAdmin(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.role = Role.ADMIN;
    const updatedUser = await this.usersRepository.save(user);

    return this.sanitizeUser(updatedUser);
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
}
