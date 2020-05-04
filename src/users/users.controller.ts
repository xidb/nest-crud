import {
  UseGuards,
  Inject,
  Controller,
  Body,
  Param,
  UseInterceptors,
  Get,
  Post,
  Put,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotFoundInterceptor } from '../interceptors/not-found.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersDuplicateExceptionFilter } from './exception-filters/duplicate.exception-filter';
import { IUser } from './interfaces/user.interface';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async findAll(): Promise<IUser[]> {
    return this.usersService.findAll();
  }

  @Post()
  @UseFilters(UsersDuplicateExceptionFilter)
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.create(createUserDto);
  }

  @Put(':id')
  @UseFilters(UsersDuplicateExceptionFilter)
  @UseInterceptors(new NotFoundInterceptor('User not found'))
  async update(
    @Param('id') id: IUser['_id'],
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseInterceptors(new NotFoundInterceptor('User not found'))
  async remove(@Param('id') id: IUser['_id']): Promise<boolean> {
    return this.usersService.remove(id);
  }
}
