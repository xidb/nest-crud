import { ArrayUnique, IsString } from 'class-validator';
import { ContextAwareDto } from '../../validation/context-aware.dto';

export class CreateGroupDto extends ContextAwareDto {
  @IsString()
  readonly name: string;

  @IsString({ each: true })
  @ArrayUnique()
  readonly collectionIds: string[];
}
