import { ArrayUnique, IsOptional, IsString } from 'class-validator';
import { ContextAwareDto } from '../../validation/context-aware.dto';

export class UpdateGroupDto extends ContextAwareDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString({ each: true })
  @ArrayUnique()
  readonly collectionIds: string[];
}
