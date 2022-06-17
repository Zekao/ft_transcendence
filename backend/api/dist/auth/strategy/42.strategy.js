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
            clientID: "56a35818a4307260d0d9cae57246e63197f2aa86ae7106c867724387cb0899c5",
            clientSecret: "52d28d9ac2ba76d75e5a13258e6c17d194803909dafc2b371d9296fd20a9e7fe",
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