import { IsString, Validate } from 'class-validator';
import { ContextAwareDto } from '../../validation/context-aware.dto';
import { ParentIdValidator } from '../validators/parent-id.validator';

export class CreateItemDto extends ContextAwareDto {
  @IsString()
  readonly name: string;

  @IsString()
  @Validate(ParentIdValidator, { message: 'Collection invalid' })
  readonly parentId: string;
}
