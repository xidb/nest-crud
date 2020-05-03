import {
  Controller,
  Body,
  Param,
  UseInterceptors,
  Get,
  Post,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';
import { NotFoundInterceptor } from '../interceptors/not-found.interceptor';
import { UsersDuplicateExceptionFilter } from './exception-filters/duplicate.exception-filter';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<IUser[]> {
    return this.usersService.findAll();
  }

  @Post()
  @UseFilters(UsersDuplicateExceptionFilter)
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.create(createUserDto);
  }

  @Delete(':id')
  @UseInterceptors(new NotFoundInterceptor('User not found'))
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.usersService.remove(id);
  }
}
