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
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { IGroup } from './interfaces/group.interface';
import { GroupsService } from './groups.service';

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly groupsService: GroupsService,
  ) {}

  @Get()
  async findAll(): Promise<IGroup[]> {
    this.groupsService.setActor(this.request.user);
    return this.groupsService.findAll();
  }

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto): Promise<void> {
    this.groupsService.setActor(this.request.user);
    await this.groupsService.create(createGroupDto);
  }

  @Put(':id')
  @UseInterceptors(new NotFoundInterceptor('Group not found'))
  async update(
    @Param('id') id: IGroup['_id'],
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<boolean | void> {
    this.groupsService.setActor(this.request.user);
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @UseInterceptors(new NotFoundInterceptor('Group not found'))
  async remove(@Param('id') id: IGroup['_id']): Promise<boolean | void> {
    this.groupsService.setActor(this.request.user);
    return this.groupsService.remove(id);
  }
}
