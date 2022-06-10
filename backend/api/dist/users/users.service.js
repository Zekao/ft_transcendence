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
exports.UsersService = exports.UserRelationsPicker = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const users_enum_1 = require("./users.enum");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("./users.entity");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const utils_1 = require("../utils/utils");
const user_dto_1 = require("./dto/user.dto");
class UserRelationsPicker {
}
exports.UserRelationsPicker = UserRelationsPicker;
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
    async getFriends(id) {
        const user = await this.getUserId(id, { withFriends: true });
        if (!user.friends)
            return [];
        const friends = user.friends.map((friend) => {
            return new user_dto_1.UserDto(friend);
        });
        return friends;
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
    async getUserId(id, RelationsPicker) {
        const relations = [];
        if (RelationsPicker) {
            RelationsPicker.withFriends && relations.push("friends");
        }
        let found = null;
        if ((0, utils_1.isUuid)(id))
            found = await this.UserRepository.findOne({
                where: { id: id },
                relations,
            });
        else
            found = await this.UserRepository.findOne({
                where: { user_name: id },
                relations,
            });
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
        return (await this.getUserId(id)).first_name;
    }
    async getLastName(id) {
        return (await this.getUserId(id)).last_name;
    }
    async getUserName(id) {
        return (await this.getUserId(id)).user_name;
    }
    async getEmail(id) {
        return (await this.getUserId(id)).email;
    }
    async getStatus(id) {
        return (await this.getUserId(id)).status;
    }
    async getGameStatus(id) {
        return (await this.getUserId(id)).in_game;
    }
    async getWin(id) {
        return (await this.getUserId(id)).win;
    }
    async getLoose(id) {
        return (await this.getUserId(id)).loose;
    }
    async getRank(id) {
        return (await this.getUserId(id)).rank;
    }
    async getRatio(id) {
        return (await this.getUserId(id)).ratio.toPrecision(2);
    }
    async getAvatar(id, res) {
        return res.sendFile((await this.getUserId(id)).avatar, { root: "./files" });
    }
    async getAvatarPath(id) {
        return (await this.getUserId(id)).avatar;
    }
    async createUsers(authCredentialsDto) {
        const { user_name, password } = authCredentialsDto;
        const stat = users_enum_1.UserStatus.ONLINE;
        const user = this.UserRepository.create({
            status: stat,
            in_game: users_enum_1.UserGameStatus.OUT_GAME,
            user_name,
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
    async addFriend(id, friend_id) {
        if (friend_id == id)
            throw new common_1.BadRequestException("You can't add yourself");
        const found = await this.getUserId(id, { withFriends: true });
        const friend = await this.getUserId(friend_id);
        if (!found.friends)
            found.friends = [];
        if (found.friends.includes(friend)) {
            console.log("Already friends");
            throw new common_1.ConflictException("Already friend");
        }
        found.friends.push(friend);
        this.UserRepository.save(found);
        return friend;
    }
    async uploadFile(id, file) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        if (!file)
            throw new common_1.NotFoundException(`Avatar not found`);
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
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        const target = await this.UserRepository.delete(found);
        if (target.affected === 0)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return true;
    }
    async deleteAvatar(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        if (found.avatar == "default/img_avatar.png")
            throw new common_1.UnauthorizedException(`Default avatar cannot be deleted`);
        try {
            fs.unlinkSync("./files/" + found.avatar);
            found.avatar = "default/img_avatar.png";
            this.UserRepository.save(found);
        }
        catch (err) {
            throw new common_1.NotFoundException(`Avatar \`${id}' not found`);
        }
        return true;
    }
    async patchUser(id, query) {
        const { firstname, lastname, email, status, ingame, win, loose, rank, ratio } = query;
        const found = await this.getUserId(id);
        if (firstname)
            found.first_name = firstname;
        if (lastname)
            found.last_name = lastname;
        if (email)
            found.email = email;
        if (status)
            found.status = status;
        if (ingame)
            found.in_game = ingame;
        if (win)
            found.win = win;
        if (loose)
            found.loose = loose;
        if (rank)
            found.rank = rank;
        if (ratio)
            found.ratio = ratio;
        this.UserRepository.save(found);
        return found;
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
    async patchStatus(id, userStatusDto) {
        const found = await this.getUserId(id);
        const { status } = userStatusDto;
        if (!status)
            throw new common_1.UnauthorizedException(`Invalid user status`);
        found.status = status;
        this.UserRepository.save(found);
        return found.status;
    }
    async patchUserGameStatus(id, userGameStatusDto) {
        const found = await this.getUserId(id);
        const { in_game } = userGameStatusDto;
        if (!in_game)
            throw new common_1.UnauthorizedException(`Invalid game status`);
        found.in_game = in_game;
        this.UserRepository.save(found);
        return found.in_game;
    }
    async patchWin(id, win) {
        const found = await this.getUserId(id);
        found.win = win;
        this.UserRepository.save(found);
        this.patchUpdateRank();
        return found.win;
    }
    async patchLoose(id, loose) {
        const found = await this.getUserId(id);
        found.loose = loose;
        this.UserRepository.save(found);
        this.patchUpdateRank();
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