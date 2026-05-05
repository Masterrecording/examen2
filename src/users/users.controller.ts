import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UsersService } from './users.service';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.DEVELOPER, Role.ADMIN)
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  create(
    @Body()
    body: {
      nombre: string;
      username: string;
      password: string;
      role: Role;
    },
  ) {
    return this.usersService.create(body);
  }

  @Get()
  @Roles(Role.USER, Role.DEVELOPER, Role.ADMIN)
  @ApiOperation({ summary: 'Obtener usuarios o perfil actual' })
  @ApiResponse({ status: 200, description: 'Usuarios obtenidos' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  findAll(@Req() request: RequestWithUser) {
    return this.usersService.findAll(request.user.id, request.user.role);
  }

  @Patch(':id')
  @Roles(Role.DEVELOPER, Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  update(
    @Param('id') id: string,
    @Body()
    body: {
      nombre?: string;
      username?: string;
      password?: string;
      role?: Role;
    },
  ) {
    return this.usersService.update(Number(id), body);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }

  @Patch(':id/make-admin')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Convertir usuario en admin' })
  @ApiResponse({ status: 200, description: 'Usuario promovido a admin' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  makeAdmin(@Param('id') id: string) {
    return this.usersService.makeAdmin(Number(id));
  }
}