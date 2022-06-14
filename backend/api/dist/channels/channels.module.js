"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const channels_controller_1 = require("./channels.controller");
const channels_entity_1 = require("./channels.entity");
const channels_service_1 = require("./channels.service");
const channels_gateway_1 = require("./channels.gateway");
const jwt_1 = require("@nestjs/jwt");
const users_module_1 = require("../users/users.module");
const auth_module_1 = require("../auth/auth.module");
const chat_gateway_1 = require("./chat.gateway");
const status_gateway_1 = require("./status.gateway");
const game_gateway_1 = require("./game.gateway");
const matchs_module_1 = require("../matchs/matchs.module");
let ChannelsModule = class ChannelsModule {
};
ChannelsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            matchs_module_1.MatchsModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            typeorm_1.TypeOrmModule.forFeature([channels_entity_1.Channel]),
        ],
        controllers: [channels_controller_1.ChannelsController],
        providers: [
            channels_service_1.ChannelsService,
            channels_gateway_1.ChannelsGateway,
            chat_gateway_1.ChatGateway,
            status_gateway_1.StatusGateway,
            jwt_1.JwtService,
            game_gateway_1.GameGateway,
        ],
    })
], ChannelsModule);
exports.ChannelsModule = ChannelsModule;
//# sourceMappingURL=channels.module.js.map