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
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { IItem } from './interfaces/item.interface';
import { ItemsService } from './items.service';

@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemsController {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly itemsService: ItemsService,
  ) {}

  @Get()
  async findAll(): Promise<IItem[]> {
    this.itemsService.setActor(this.request.user);
    return this.itemsService.findAll();
  }

  @Post()
  async create(@Body() createItemDto: CreateItemDto): Promise<IItem> {
    this.itemsService.setActor(this.request.user);
    return await this.itemsService.create(createItemDto);
  }

  @Put(':id')
  @UseInterceptors(new NotFoundInterceptor('Item not found'))
  async update(
    @Param('id') id: IItem['_id'],
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<boolean | void> {
    this.itemsService.setActor(this.request.user);
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @UseInterceptors(new NotFoundInterceptor('Item not found'))
  async remove(@Param('id') id: IItem['_id']): Promise<boolean | void> {
    this.itemsService.setActor(this.request.user);
    return this.itemsService.remove(id);
  }
}
