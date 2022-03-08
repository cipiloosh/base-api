import { NestFactory } from '@nestjs/core';
import fastifyCookie from 'fastify-cookie';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

const corsOptions = {
  origin: process.env.API_ROOT_DOMAIN,
  methods: ['GET', 'PUT', 'POST'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors(corsOptions);

  app.register(fastifyCookie, {
    secret: 'my-secret', // for cookies signature
  });
  await app.listen(5000);
}
bootstrap();
