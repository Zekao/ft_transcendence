"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const matches_entity_1 = require("./matches.entity");
const matches_controller_1 = require("./matches.controller");
const matches_service_1 = require("./matches.service");
let MatchesModule = class MatchesModule {
};
MatchesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([matches_entity_1.Matches]),
            auth_module_1.AuthModule,
        ],
        controllers: [matches_controller_1.MatchesController],
        providers: [matches_service_1.MatchesService, jwt_1.JwtService],
    })
], MatchesModule);
exports.MatchesModule = MatchesModule;
//# sourceMappingURL=matches.module.js.map