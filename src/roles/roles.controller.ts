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
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotFoundInterceptor } from '../interceptors/not-found.interceptor';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IRole } from './interfaces/role.interface';
import { RolesService } from './roles.service';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly rolesService: RolesService,
  ) {}

  @Get()
  async findAll(): Promise<IRole[]> {
    this.rolesService.setActor(this.request.user);
    return this.rolesService.findAll();
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<void> {
    this.rolesService.setActor(this.request.user);
    await this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  @UseInterceptors(new NotFoundInterceptor('Role not found'))
  async update(
    @Param('id') id: IRole['_id'],
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<boolean | void> {
    this.rolesService.setActor(this.request.user);
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @UseInterceptors(new NotFoundInterceptor('Role not found'))
  async remove(@Param('id') id: IRole['_id']): Promise<boolean | void> {
    this.rolesService.setActor(this.request.user);
    return this.rolesService.remove(id);
  }
}
