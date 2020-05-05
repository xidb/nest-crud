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
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ICollection } from './interfaces/collection.interface';
import { CollectionsService } from './collections.service';

@UseGuards(JwtAuthGuard)
@Controller('collections')
export class CollectionsController {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly collectionsService: CollectionsService,
  ) {}

  @Get()
  async findAll(): Promise<ICollection[]> {
    console.log(this.request.user);
    this.collectionsService.setActor(this.request.user);
    return this.collectionsService.findAll();
  }

  @Post()
  async create(
    @Body() createCollectionDto: CreateCollectionDto,
  ): Promise<ICollection> {
    this.collectionsService.setActor(this.request.user);
    return await this.collectionsService.create(createCollectionDto);
  }

  @Put(':id')
  @UseInterceptors(new NotFoundInterceptor('Collection not found'))
  async update(
    @Param('id') id: ICollection['_id'],
    @Body() updateCollectionDto: UpdateCollectionDto,
  ): Promise<boolean | void> {
    this.collectionsService.setActor(this.request.user);
    return this.collectionsService.update(id, updateCollectionDto);
  }

  @Delete(':id')
  @UseInterceptors(new NotFoundInterceptor('Collection not found'))
  async remove(@Param('id') id: ICollection['_id']): Promise<boolean | void> {
    this.collectionsService.setActor(this.request.user);
    return this.collectionsService.remove(id);
  }
}
