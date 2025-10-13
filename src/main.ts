import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // Elimina propiedades no esperadas
      // forbidNonWhitelisted: true, // Lanza error si hay propiedades no esperadas
      transform: true, // ¡ESTA OPCIÓN ES CRUCIAL! Habilita la transformación de tipos.
      transformOptions: {
        enableImplicitConversion: true, // Permite la conversión implícita (útil si @Transform no es suficiente en algunos casos, pero @Transform es más explícito)
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
