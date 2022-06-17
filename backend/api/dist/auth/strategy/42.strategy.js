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
            clientID: "219b4f87732a059d270fe71c699bad22dcd750d27d82c5086a0f12044c1f263d",
            clientSecret: "44d49e2767bda2d40994b9a453b92c0356eb540c2f94a6ce5499289839e0c330",
            callbackURL: "https://ft.localhost:4500/login",
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
