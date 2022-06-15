import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import "reflect-metadata";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle("Ft_transcendence Api")
    .setDescription("Wonderful pong game")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("doc", app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true,
  });
  await app.listen(3000);
}
bootstrap();
