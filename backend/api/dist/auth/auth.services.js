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
const jwt_1 = require("@nestjs/jwt");
const users_entity_1 = require("../users/users.entity");
const users_service_1 = require("../users/users.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const fs = require("fs");
let AuthService = class AuthService {
    constructor(jwtService, userRepository, userService) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userService = userService;
    }
    GenerateJwtToken(FortyTwoID, firstime) {
        const payload = { FortyTwoID };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken, firstime };
    }
    GenerateGToken(Gtoken) {
        const payload = { Gtoken };
        const gtoken = this.jwtService.sign(payload);
        return { gtoken };
    }
    verifyJwtToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (err) { }
    }
    async handleFortyTwo(Ftwo) {
        const user = await this.userRepository.findOne({
            where: { FortyTwoID: Ftwo.id },
        });
        if (!user) {
            const AuthCredentialsDto = {
                FortyTwoID: Ftwo.id,
                first_name: Ftwo.first_name,
                last_name: Ftwo.last_name,
                user_name: Ftwo.login,
                email: Ftwo.email,
                avatar: Ftwo.image_url,
            };
            return this.signUp(AuthCredentialsDto);
        }
        const LoginFortyTwoDto = {
            FortyTwoID: Ftwo.id,
        };
        return this.signIn(LoginFortyTwoDto);
    }
    async signIn(loginFortyTwoDto) {
        const { FortyTwoID } = loginFortyTwoDto;
        const user = await this.userRepository.findOne({
            where: { FortyTwoID: FortyTwoID },
        });
        if (user) {
            if (user.First_time === false) {
                user.First_time = false;
                await this.userService.saveUser(user);
            }
            this.GenerateJwtToken(FortyTwoID, user.First_time);
        }
        else {
            throw new common_1.UnauthorizedException("Incorrect user id");
        }
    }
    async signUp(AuthCredentialsDto) {
        return this.userService.createUsers(AuthCredentialsDto);
    }
    async getUserFromSocket(client) {
        const token = client.handshake.auth.Authorization;
        if (!token)
            throw new common_1.UnauthorizedException("No token provided");
        const payload = await this.verifyJwtToken(token);
        if (!payload)
            throw new common_1.UnauthorizedException("Invalid token provided");
        return this.userService.getUserFortyTwo(payload.FortyTwoID);
    }
    async verifyGToken(user_token, user) {
        const verified = speakeasy.totp.verify({
            secret: user.TwoFAVerify,
            encoding: "ascii",
            token: user_token,
        });
        return verified;
    }
    async generateQR(id) {
        const secret = speakeasy.generateSecret({
            name: "Ft_transcendence",
        });
        const QRObjects = {
            qrcode: await qrcode.toDataURL(secret.otpauth_url),
            secret: secret.ascii,
        };
        id.TwoFAVerify = secret.ascii;
        this.userService.saveUser(id);
        return QRObjects;
    }
    async verifyQR(user_token, user) {
        const file = user.user_name + ".png";
        try {
            fs.unlinkSync("image/google/" + file);
        }
        catch (err) { }
        const verified = speakeasy.totp.verify({
            secret: user.TwoFAVerify,
            encoding: "ascii",
            token: user_token,
        });
        return verified;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository,
        users_service_1.UsersService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.services.js.map