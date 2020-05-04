import { Injectable } from '@nestjs/common';
import { IActor } from '../users/interfaces/actor.interface';

@Injectable()
export class BaseService {
  protected actor: IActor;

  setActor(actor): void {
    if (!this.actor) {
      this.actor = actor;
    }
  }
}
