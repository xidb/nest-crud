import { ArrayUnique, IsArray, IsString, Validate } from 'class-validator';
import { ContextAwareDto } from '../../validation/context-aware.dto';
import { CollectionIdsValidator } from '../validators/collection-ids.validator';

export class CreateGroupDto extends ContextAwareDto {
  @IsString()
  readonly name: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @Validate(CollectionIdsValidator, {
    message: 'Collection invalid or already belongs to another group',
  })
  readonly collectionIds: string[];
}
