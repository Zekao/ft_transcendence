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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../users/users.entity");
const bcrpyt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const typeorm_2 = require("typeorm");
let AuthService = class AuthService {
    constructor(UsersRepository, JwtService) {
        this.UsersRepository = UsersRepository;
        this.JwtService = JwtService;
    }
    async signUp(AuthCredentialsDto) {
        return this.UsersRepository.createUser(AuthCredentialsDto);
    }
    async signIn(AuthCredentialsDto) {
        const { user_name, password } = AuthCredentialsDto;
        const user = await this.UsersRepository.findOne({
            where: { user_name: user_name },
        });
        if (user && (await bcrpyt.compare(password, user.password))) {
            const payload = { user_name };
            const accessToken = await this.JwtService.sign(payload);
            return { accessToken };
        }
        else {
            throw new common_1.UnauthorizedException("Incorrect password or username");
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map