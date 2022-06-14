"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const matchs_entity_1 = require("./matchs.entity");
const matchs_controller_1 = require("./matchs.controller");
const matchs_service_1 = require("./matchs.service");
const users_module_1 = require("../users/users.module");
const users_entity_1 = require("../users/users.entity");
const users_service_1 = require("../users/users.service");
const auth_services_1 = require("../auth/auth.services");
const game_gateway_1 = require("./game.gateway");
let MatchsModule = class MatchsModule {
};
MatchsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([matchs_entity_1.Matchs, users_entity_1.User]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
        ],
        controllers: [matchs_controller_1.MatchsController],
        providers: [
            matchs_service_1.MatchsService,
            jwt_1.JwtService,
            users_service_1.UsersService,
            auth_services_1.AuthService,
            game_gateway_1.GameGateway,
        ],
    })
], MatchsModule);
exports.MatchsModule = MatchsModule;
//# sourceMappingURL=matchs.module.js.map