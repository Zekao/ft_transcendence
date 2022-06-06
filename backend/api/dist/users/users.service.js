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
        nick = nick.length > 8 ? nick.slice(0, 8) : nick;
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
function isId(id) {
    const splited = id.split("-");
    return (id.length === 36 &&
        splited.length === 5 &&
        splited[0].length === 8 &&
        splited[1].length === 4 &&
        splited[2].length === 4 &&
        splited[3].length === 4 &&
        splited[4].length === 12);
}
let UsersService = class UsersService {
    constructor(UserRepository) {
        this.UserRepository = UserRepository;
    }
    async getUsers() {
        const users = await this.UserRepository.find();
        if (!users)
            throw new common_1.NotFoundException(`Users not found`);
        return users;
    }
    async getUserByFilter(filter) {
        const { status, username } = filter;
        let users = await this.getUsers();
        if (status)
            users = users.filter((user) => user.status === status);
        if (username)
            users = users.filter((user) => {
                if (user.id.includes(username))
                    return true;
                if (user.first_name.includes(username))
                    return true;
                if (user.last_name.includes(username))
                    return true;
                if (user.user_name.includes(username))
                    return true;
                if (user.email.includes(username))
                    return true;
            });
        if (!users)
            throw new common_1.NotFoundException(`Users not found`);
        return users;
    }
    async getUserId(id) {
        let found = null;
        if (isId(id))
            found = await this.UserRepository.findOne({ where: { id: id } });
        else
            found = await this.UserRepository.findOne({ where: { user_name: id } });
        if (!found)
            if (!found)
                throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found;
    }
    async getFirstName(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found.first_name;
    }
    async getLastName(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found.last_name;
    }
    async getUserName(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found.user_name;
    }
    async getEmail(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found.email;
    }
    async getStatus(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found.status;
    }
    async getGameStatus(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found.in_game;
    }
    async getWin(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found.win;
    }
    async getLoose(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found.loose;
    }
    async getRank(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found.rank;
    }
    async createUser(createUser) {
        const { first_name, last_name } = createUser;
        const username = setNickName(await this.getUsers(), first_name, last_name);
        const user = this.UserRepository.create({
            first_name,
            last_name,
            user_name: username,
            email: `${username}@transcendence.com`,
            status: users_status_enum_1.UserStatus.ONLINE,
            in_game: users_status_enum_1.UserGameStatus.OUT_GAME,
            win: 0,
            loose: 0,
            rank: 0,
        });
        await this.UserRepository.save(user);
        return user;
    }
    async deleteUser(id) {
        const target = await this.UserRepository.delete(id);
        if (target.affected === 0)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
    }
    async patchFirstName(id, first_name) {
        const found = await this.getUserId(id);
        found.first_name = first_name;
        this.UserRepository.save(found);
        return found.first_name;
    }
    async patchLastName(id, last_name) {
        const found = await this.getUserId(id);
        found.last_name = last_name;
        this.UserRepository.save(found);
        return found.last_name;
    }
    async patchUserName(id, user_name) {
        const users = await this.getUsers();
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id)
                continue;
            if (users[i].user_name === user_name)
                throw new common_1.ConflictException(`username \`${user_name}' already exist`);
        }
        const found = await this.getUserId(id);
        found.user_name = user_name;
        this.UserRepository.save(found);
        return found.user_name;
    }
    async patchEmail(id, email) {
        const found = await this.getUserId(id);
        found.email = email;
        this.UserRepository.save(found);
        return found.email;
    }
    async patchStatus(id, status) {
        const found = await this.getUserId(id);
        found.status = status;
        this.UserRepository.save(found);
        return found.status;
    }
    async patchUserGameStatus(id, in_game) {
        const found = await this.getUserId(id);
        found.in_game = in_game;
        this.UserRepository.save(found);
        return found.in_game;
    }
    async patchWin(id, win) {
        const found = await this.getUserId(id);
        found.win = win;
        this.UserRepository.save(found);
        return found.win;
    }
    async patchLoose(id, loose) {
        const found = await this.getUserId(id);
        found.loose = loose;
        this.UserRepository.save(found);
        return found.loose;
    }
    async patchRank(id, rank) {
        const found = await this.getUserId(id);
        found.rank = rank;
        this.UserRepository.save(found);
        return found.rank;
    }
    async patchAddWin(id) {
        const found = await this.getUserId(id);
        found.win++;
        this.UserRepository.save(found);
        return found.win;
    }
    async patchAddLoose(id) {
        const found = await this.getUserId(id);
        found.loose++;
        this.UserRepository.save(found);
        return found.loose;
    }
    async patchRemoveWin(id) {
        const found = await this.getUserId(id);
        found.win--;
        this.UserRepository.save(found);
        return found.win;
    }
    async patchRemoveLoose(id) {
        const found = await this.getUserId(id);
        found.loose--;
        this.UserRepository.save(found);
        return found.loose;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map