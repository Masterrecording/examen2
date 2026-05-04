import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../enums/role.enum';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { username: registerDto.username },
    });

    if (existingUser) {
      throw new ConflictException('El username ya existe');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.usersRepository.create({
      nombre: registerDto.nombre,
      email: `${registerDto.username}@local.dev`,
      username: registerDto.username,
      password: hashedPassword,
      role: Role.USER,
    });

    const savedUser = await this.usersRepository.save(user);

    return this.sanitizeUser(savedUser);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username: loginDto.username })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async createAdminIfNotExists(): Promise<void> {
    const admin = await this.usersRepository.findOne({
      where: { username: 'admin' },
    });

    if (admin) {
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const newAdmin = this.usersRepository.create({
      nombre: 'Administrador',
      email: 'admin@local.dev',
      username: 'admin',
      password: hashedPassword,
      role: Role.ADMIN,
    });

    await this.usersRepository.save(newAdmin);
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
