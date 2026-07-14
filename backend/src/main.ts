import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin.endsWith('.vercel.app') || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(null, true); // 允许所有来源
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`易算 API server running on http://0.0.0.0:${port}`);
}
bootstrap();
