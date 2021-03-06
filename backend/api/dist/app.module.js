"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("../node_modules/@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const channels_module_1 = require("./channels/channels.module");
const matchs_module_1 = require("./matchs/matchs.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const chat_module_1 = require("./chat/chat.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            channels_module_1.ChannelsModule,
            matchs_module_1.MatchsModule,
            chat_module_1.ChatModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, "..", "image"),
                serveRoot: "/image",
                serveStaticOptions: {
                    index: false,
                },
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                host: "database",
                port: 5432,
                username: "postgres",
                password: "root",
                database: "transcendence",
                autoLoadEntities: true,
                synchronize: true,
            }),
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map