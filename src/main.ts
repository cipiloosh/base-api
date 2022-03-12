import { NestFactory } from '@nestjs/core';
import { fastifyHelmet } from 'fastify-helmet';
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
  await app.register(fastifyHelmet);
  await app.register(fastifyCookie, {
    secret: 'helloMoto',
  });
  await app.listen(5000);
}
bootstrap();
