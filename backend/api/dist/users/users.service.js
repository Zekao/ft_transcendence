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
const fs = require("fs");
const users_status_enum_1 = require("./users-status.enum");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("./users.entity");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
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
    constructor(UserRepository, JwtService) {
        this.UserRepository = UserRepository;
        this.JwtService = JwtService;
    }
    async getUsers() {
        const users = await this.UserRepository.find();
        if (!users)
            throw new common_1.NotFoundException(`Users not found`);
        return users;
    }
    async getFriends() {
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
    async getRankedUsers() {
        const users = await this.UserRepository.find({
            order: { ratio: "DESC" },
            take: 10,
        });
        if (!users)
            throw new common_1.NotFoundException(`Users not found`);
        return users;
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
    async getRatio(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found.ratio.toPrecision(2);
    }
    async getAvatar(id, res) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return res.sendFile(found.avatar, { root: "./files" });
    }
    async getAvatarPath(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found.avatar;
    }
    async createUsers(authCredentialsDto) {
        const { user_name, password } = authCredentialsDto;
        const stat = users_status_enum_1.UserStatus.ONLINE;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.UserRepository.create({
            status: stat,
            in_game: users_status_enum_1.UserGameStatus.IN_GAME,
            user_name,
            password: hashedPassword,
            email: user_name + "@transcendence.com",
            first_name: "Fake",
            last_name: "Users",
            win: 0,
            loose: 0,
            rank: 0,
            ratio: 1,
            avatar: "default/img_avatar.png",
        });
        try {
            await this.UserRepository.save(user);
            this.patchUpdateRank();
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
    async signUp(AuthCredentialsDto) {
        return this.createUsers(AuthCredentialsDto);
    }
    async addFriend(friend) {
        const found = await this.getUserId(friend);
        if (!found)
            throw new common_1.NotFoundException(`Friend \`${friend}' not found`);
        this.UserRepository.save(found);
        return found;
    }
    async signIn(AuthCredentialsDto) {
        const { user_name, password } = AuthCredentialsDto;
        const user = await this.UserRepository.findOne({
            where: { user_name: user_name },
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload = { user_name };
            const accessToken = this.JwtService.sign(payload);
            return { accessToken };
        }
        else {
            throw new common_1.UnauthorizedException("Incorrect password or username");
        }
    }
    async uploadFile(id, file) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        const response = {
            originalname: file.originalname,
            filename: file.filename,
        };
        if (found.avatar != "default/img_avatar.png") {
            this.deleteAvatar(id);
        }
        found.avatar = file.filename;
        this.UserRepository.save(found);
        return response;
    }
    async deleteUser(id) {
        const target = await this.UserRepository.delete(id);
        if (target.affected === 0)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
    }
    async deleteAvatar(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        if (found.avatar == "default/img_avatar.png")
            throw new common_1.UnauthorizedException(`Default avatar cannot be deleted`);
        try {
            fs.unlinkSync("./files/" + found.avatar);
        }
        catch (err) {
            console.error(err);
            throw new common_1.NotFoundException(`Avatar \`${id}' not found`);
        }
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
        this.patchUpdateRatio(id);
        return found.win;
    }
    async patchAddLoose(id) {
        const found = await this.getUserId(id);
        found.loose++;
        this.UserRepository.save(found);
        this.patchUpdateRatio(id);
        return found.loose;
    }
    async patchRemoveWin(id) {
        const found = await this.getUserId(id);
        if (found.loose != 0) {
            found.win--;
            this.UserRepository.save(found);
            this.patchUpdateRatio(id);
        }
        return found.win;
    }
    async patchRemoveLoose(id) {
        const found = await this.getUserId(id);
        if (found.loose != 0) {
            found.loose--;
            this.UserRepository.save(found);
            this.patchUpdateRatio(id);
        }
        return found.loose;
    }
    async patchUpdateRatio(id) {
        const found = await this.getUserId(id);
        if (found.win != 0 || found.loose != 0) {
            found.ratio = found.win / found.loose;
        }
        this.UserRepository.save(found);
        this.patchUpdateRank();
        return found.ratio;
    }
    async patchUpdateRank() {
        const found = await this.getRankedUsers();
        for (let i = 0; i < found.length; i++) {
            found[i].rank = i + 1;
            this.UserRepository.save(found[i]);
        }
        return found;
    }
};
__decorate([
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "getAvatar", null);
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map