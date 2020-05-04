import { Allow } from 'class-validator';
import { IActor } from '../users/interfaces/actor.interface';

export class ContextAwareDto {
  @Allow()
  context?: {
    params: object;
    query: object;
    user: IActor;
  };
}
