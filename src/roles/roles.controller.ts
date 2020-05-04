import {
  UseGuards,
  Controller,
  Body,
  Param,
  UseInterceptors,
  Get,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotFoundInterceptor } from '../interceptors/not-found.interceptor';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IRole } from './interfaces/role.interface';
import { RolesService } from './roles.service';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(): Promise<IRole[]> {
    return this.rolesService.findAll();
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<void> {
    await this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  @UseInterceptors(new NotFoundInterceptor('Role not found'))
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<boolean> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @UseInterceptors(new NotFoundInterceptor('Role not found'))
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.rolesService.remove(id);
  }
}
