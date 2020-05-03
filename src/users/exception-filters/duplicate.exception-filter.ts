import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class UsersDuplicateExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    if (exception.code === 11000 && typeof request.body.email !== 'undefined') {
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `e-mail ${request.body.email} is already registered`,
      });
    }
  }
}
