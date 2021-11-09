import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserRole } from './enum/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('user')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post('register')
  createUser(@Body() data: CreateUserDto): Promise<User> {
    delete data.passwordConfirmation;
    return this.service.create(data, UserRole.USER);
  }

  @Post('create-admin')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard) // para criar precisa ser o admin
  createAdmin(@Body() data: CreateUserDto): Promise<User> {
    delete data.passwordConfirmation;
    return this.service.create(data, UserRole.ADMIN);
  }

  @Get('find/:id')
  @UseGuards(AuthGuard()) // todos os usuarios LOGADOS podem procurar no sistema
  findOne(@Param('id') id: string): Promise<User> {
    return this.service.findOne(id);
  }

  @Get('find-all')
  @UseGuards(AuthGuard())
  findMany() {
    return this.service.findMany();
  }

  @Delete('delete/:id')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard) // para deletar precisa ser o admin
  deleteOne(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.deleteOne(id);
  }
}
