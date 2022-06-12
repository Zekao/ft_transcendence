"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
require("reflect-metadata");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Ft_transcendence Api")
        .setDescription("Wonderful pong game")
        .setVersion("1.0")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("doc", app, document);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors({
        origin: true,
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map