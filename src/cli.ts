import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppModule } from './app.module';

(async (): Promise<void> => {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false, // no logger
  });
  app
    .select(CommandModule)
    .get(CommandService)
    .exec();
})();
