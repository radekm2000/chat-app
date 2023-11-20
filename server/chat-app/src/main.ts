import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { S3Client } from '@aws-sdk/client-s3';
import * as cron from 'node-cron';
import { deleteTokenIfExpired } from './utils/deleteTokenIfExpired';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
export const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });
  app.use(cookieParser());
  cron.schedule(' 2 * * * * *', () => {
    deleteTokenIfExpired();
  });
  await app.listen(3000);
}
bootstrap();
