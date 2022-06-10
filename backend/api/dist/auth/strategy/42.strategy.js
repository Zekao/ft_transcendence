"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FortyTwoStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../../users/users.entity");
const passport_42_1 = require("passport-42");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../../users/users.service");
const auth_services_1 = require("../auth.services");
let FortyTwoStrategy = class FortyTwoStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy) {
    constructor(usersRepository, authService) {
        console.log(process.env);
        super({
            clientID: "360cc9c295cc9eb63bf65794b2a2a50650d8e03353db6fc515d8ac4ad651436a",
            clientSecret: "d89e41624c9c1c6dcfa0aa00a39c7f06793f8ecc79c441f519d3f96efb76ca24",
            callbackURL: "http://localhost:4500/login",
        });
        this.usersRepository = usersRepository;
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile) {
        this.authService.handleFortyTwo(profile._json);
        return profile;
    }
};
FortyTwoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(0, (0, typeorm_1.InjectRepository)(users_service_1.UsersService)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_services_1.AuthService])
], FortyTwoStrategy);
exports.FortyTwoStrategy = FortyTwoStrategy;
//# sourceMappingURL=42.strategy.js.map