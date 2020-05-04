import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStringOrNull(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function(object: object, propertyName: string): void {
    registerDecorator({
      name: 'IsStringOrNull',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          return typeof value === 'string' || value === null;
        },
      },
    });
  };
}
