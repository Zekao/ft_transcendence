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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_status_enum_1 = require("./users-status.enum");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("./users.entity");
const typeorm_2 = require("typeorm");
function setNickName(users, first, last) {
    let nick;
    let first_size = 1;
    let cond = false;
    while (!cond) {
        cond = true;
        nick = `${first.slice(0, first_size)}${last}`;
        for (let i = 0; i < users.length; i++) {
            if (users[i].user_name === nick) {
                if (first_size < first.length)
                    first_size++;
                cond = false;
            }
            continue;
        }
    }
    return nick;
}
let UsersService = class UsersService {
    constructor(UserRepository) {
        this.UserRepository = UserRepository;
    }
    ;
    async getUser() {
        return this.UserRepository.find();
    }
    async getUsers() {
        const users = await this.UserRepository.find();
        if (!users)
            throw new common_1.NotFoundException(`Users not found`);
        return users;
    }
    async getUserByFilter(filter) {
        const { status, search } = filter;
        let users = await this.getUsers();
        if (status)
            users = users.filter((user) => user.status === status);
        if (search)
            users = users.filter((user) => {
                if (user.id.includes(search))
                    return true;
                if (user.first_name.includes(search))
                    return true;
                if (user.last_name.includes(search))
                    return true;
                if (user.user_name.includes(search))
                    return true;
                if (user.email.includes(search))
                    return true;
            });
        if (!users)
            throw new common_1.NotFoundException(`Users not found`);
        return users;
    }
    async getUserId(id) {
        const found = await this.UserRepository.findOne(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found;
    }
    async getUserStatus(id) {
        const found = await this.UserRepository.findOne(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found.status;
    }
    async createUser(createUser) {
        const { first_name, last_name } = createUser;
        const username = setNickName(await this.getUser(), first_name, last_name);
        const user = this.UserRepository.create({
            first_name,
            last_name,
            user_name: username,
            email: `${username}@transcendence.com`,
            status: users_status_enum_1.UserStatus.ONLINE
        });
        await this.UserRepository.save(user);
        return user;
    }
    async deleteUser(id) {
        const target = await this.UserRepository.delete(id);
        if (target.affected === 0)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
    }
    async patchStatus(id, status) {
        const found = await this.UserRepository.findOne(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}\` not found`);
        found.status = status;
        return found.status;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map