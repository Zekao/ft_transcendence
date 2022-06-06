import { ValidationPipe } from "node_modulessss/@nestjs/common";
import { NestFactory } from "node_modulessss/@nestjs/core";
import { NestExpressApplication } from 'node_modulessss/@nestjs/platform-express';
import { AppModule } from "./app.module";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.enableCors({
    origin: true,
  });
  await app.listen(3000);
}
bootstrap();
