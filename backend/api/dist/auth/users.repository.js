"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const users_status_enum_1 = require("../users/users-status.enum");
const users_status_enum_2 = require("../users/users-status.enum");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcrypt");
let UsersRepository = class UsersRepository extends typeorm_1.Repository {
    async createUser(authCredentialsDto) {
        const { user_name, password } = authCredentialsDto;
        const stat = users_status_enum_1.UserStatus.ONLINE;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.create({
            status: stat,
            in_game: users_status_enum_2.UserGameStatus.IN_GAME,
            user_name,
            password: hashedPassword,
            email: user_name + "@transcendence.com",
            first_name: "Fake",
            last_name: "Users",
            win: 0,
            loose: 0,
            rank: 0,
            ratio: 1,
        });
        console.log("salt value : ", salt);
        console.log(user.user_name, user.password, user.email);
        try {
            await this.save(user);
        }
        catch (error) {
            if (error.code == "23505") {
                throw new common_1.ConflictException("Username already exists");
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
    }
};
UsersRepository = __decorate([
    (0, typeorm_1.EntityRepository)(user_entity_1.User)
], UsersRepository);
exports.UsersRepository = UsersRepository;
//# sourceMappingURL=users.repository.js.map