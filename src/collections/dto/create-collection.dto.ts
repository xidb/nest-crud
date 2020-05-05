import { IsString } from 'class-validator';
import { ContextAwareDto } from '../../validation/context-aware.dto';

export class CreateCollectionDto extends ContextAwareDto {
  @IsString()
  readonly name: string;
}
