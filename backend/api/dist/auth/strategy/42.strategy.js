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
let FortyTwoStrategy = class FortyTwoStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy) {
    constructor(usersRepository) {
        console.log(process.env);
        super({
            clientID: "1d54373ef2df42a5273b49008cb047a94b1b1baf6f7202c9855112e9646461f3",
            clientSecret: "4c59774b6a90907bb513aa2ad708f73c705a9e02def13670b5626a1affd98458",
            callbackURL: "http://localhost:4500/Account",
        });
        this.usersRepository = usersRepository;
    }
    async validate(accessToken, refreshToken, profile) {
        return profile;
    }
};
FortyTwoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(0, (0, typeorm_1.InjectRepository)(users_service_1.UsersService)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FortyTwoStrategy);
exports.FortyTwoStrategy = FortyTwoStrategy;
//# sourceMappingURL=42.strategy.js.map