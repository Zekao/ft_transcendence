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
    async getUserFortyTwo(FortyTwoID) {
        const users = await this.UserRepository.findOne({
            where: { FortyTwoID: FortyTwoID },
        });
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
    async getBlocked(id) {
        const user = await this.getUserId(id, { withBlocked: true });
        if (!user.blockedUsers)
            return [];
        const blocked = user.blockedUsers.map((blocked) => {
            return new user_dto_1.UserDto(blocked);
        });
        return blocked;
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
            RelationsPicker.withBlocked && relations.push("blockedUsers");
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
    async getDisplayName(id) {
        return (await this.getUserId(id)).display_name;
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
    async createUsers(authCredentialsDto) {
        const { FortyTwoID, user_name, first_name, last_name, avatar } = authCredentialsDto;
        const stat = users_enum_1.UserStatus.ONLINE;
        const user = this.UserRepository.create({
            FortyTwoID: FortyTwoID,
            status: stat,
            in_game: users_enum_1.UserGameStatus.OUT_GAME,
            user_name: user_name,
            display_name: user_name,
            email: user_name + "@transcendence.com",
            first_name: first_name,
            last_name: last_name,
            TwoFA: false,
            win: 0,
            loose: 0,
            rank: 0,
            ratio: 1,
            avatar: avatar,
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
        const friend = await this.getUserId(friend_id, { withBlocked: true });
        if (!found.friends)
            found.friends = [];
        if (friend.blockedUsers.find((f) => f.id === found.id))
            throw new common_1.ConflictException(`You are blocked by \`${friend_id}'`);
        if (found.friends.find((f) => f.id == friend.id))
            throw new common_1.ConflictException("Already friend");
        found.friends.push(friend);
        this.UserRepository.save(found);
        return friend;
    }
    async addBlocked(id, blockedUsersId) {
        if (blockedUsersId === id)
            throw new common_1.BadRequestException("You can't add yourself");
        const found = await this.getUserId(id, { withBlocked: true });
        const blockedUser = await this.getUserId(blockedUsersId, { withFriends: true });
        if (!found.blockedUsers)
            found.blockedUsers = [];
        if (found.blockedUsers.find((f) => f.id == blockedUser.id))
            throw new common_1.ConflictException("Already blocked");
        found.blockedUsers.push(blockedUser);
        this.UserRepository.save(found);
        if (blockedUser.friends.find((f) => f.id == found.id))
            this.removeFriend(blockedUsersId, id);
        return blockedUser;
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
    async removeFriend(id, friend_id) {
        const user = await this.getUserId(id, { withFriends: true });
        if (!user.friends || !user.friends.length)
            throw new common_1.NotFoundException(`User \`${id}' has no friends`);
        const friend = await this.getUserId(friend_id);
        if (!user.friends.find((f) => f.id == friend.id))
            throw new common_1.NotFoundException(`User \`${id}' has no friend \`${friend_id}'`);
        user.friends = user.friends.filter((f) => f.id != friend.id);
        this.UserRepository.save(user);
        return friend;
    }
    async removeBlocked(id, blockedUsersId) {
        const user = await this.getUserId(id, { withBlocked: true });
        if (!user.blockedUsers || !user.blockedUsers.length)
            throw new common_1.NotFoundException(`User \`${id}' has no blocked users`);
        const blockedUser = await this.getUserId(id);
        if (!user.blockedUsers.find((f) => f.id == blockedUser.id))
            throw new common_1.NotFoundException(`User \`${id}' has no blocked user \`${blockedUsersId}'`);
        user.blockedUsers = user.blockedUsers.filter((f) => f.id == blockedUser.id);
        this.UserRepository.save(user);
        return blockedUser;
    }
    async patchUser(id, query) {
        const { firstname, lastname, display_name, email, status, ingame, win, loose, rank, ratio, } = query;
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