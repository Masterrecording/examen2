import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

dotenv.config();

const sslCaPath = process.env.DB_SSL_CA_PATH
  ? join(process.cwd(), process.env.DB_SSL_CA_PATH)
  : undefined;

const sslOptions =
process.env.DB_SSL === 'true' && sslCaPath && existsSync(sslCaPath)
    ? {
        ca: readFileSync(sslCaPath, 'utf8'),
        rejectUnauthorized: true,
      }
    : undefined;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: sslOptions,
      entities: [User],
      synchronize: false,
      autoLoadEntities: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'super_secret_jwt_key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
