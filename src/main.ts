import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);
}
bootstrap();
