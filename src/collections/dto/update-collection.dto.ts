import { IsOptional, IsString } from 'class-validator';
import { ContextAwareDto } from '../../validation/context-aware.dto';

export class UpdateCollectionDto extends ContextAwareDto {
  @IsOptional()
  @IsString()
  readonly name: string;
}
