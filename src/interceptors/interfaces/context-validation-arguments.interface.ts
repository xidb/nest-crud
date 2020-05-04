import { ValidationArguments } from 'class-validator';
import { IActor } from '../../users/interfaces/actor.interface';

export interface IContextValidatonArguments extends ValidationArguments {
  object: {
    context: {
      params: object;
      query: object;
      user: IActor;
    };
  };
}
