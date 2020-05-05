import { IsOptional, IsString, Validate } from 'class-validator';
import { ContextAwareDto } from '../../validation/context-aware.dto';
import { ParentIdValidator } from '../validators/parent-id.validator';

export class UpdateItemDto extends ContextAwareDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  @Validate(ParentIdValidator, { message: 'Collection invalid' })
  readonly parentId: string;
}
