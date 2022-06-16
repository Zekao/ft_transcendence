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
const matchs_service_1 = require("../matchs/matchs.service");
const path_1 = require("path");
class UserRelationsPicker {
}
exports.UserRelationsPicker = UserRelationsPicker;
let UsersService = class UsersService {
    constructor(UserRepository, MatchsService, JwtService) {
        this.UserRepository = UserRepository;
        this.MatchsService = MatchsService;
        this.JwtService = JwtService;
    }
    async getUsers(RelationsPicker) {
        const relations = [];
        if (RelationsPicker) {
            for (const relation of RelationsPicker) {
                relation.withFriends && relations.push("friends");
                relation.withBlocked && relations.push("blockedUsers");
                relation.withMatchs && relations.push("matchs");
            }
        }
        const users = await this.UserRepository.find({ relations });
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
        const user = await this.getUserId(id, [{ withFriends: true }]);
        if (!user.friends)
            return [];
        const friends = user.friends.map((friend) => {
            return new user_dto_1.UserDto(friend);
        });
        return friends;
    }
    async getMatchs(id) {
        const user = await this.getUserId(id, [{ withMatchs: true }]);
        if (!user.matchs)
            return [];
        console.log(user.matchs);
        const matchs = [];
        for (const match of user.matchs) {
            matchs.push(await this.MatchsService.getMatchsId(match.id, [{ withUsers: true }]));
        }
        console.log(matchs);
        return matchs;
    }
    async getBlocked(id) {
        const user = await this.getUserId(id, [{ withBlocked: true }]);
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
                if (user.display_name.includes(username))
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
            for (const relation of RelationsPicker) {
                relation.withFriends && relations.push("friends");
                relation.withBlocked && relations.push("blockedUsers");
                relation.withMatchs && relations.push("matchs");
                relation.withChannels &&
                    relations.push("joinedChannels") &&
                    relations.push("adminedChannels") &&
                    relations.push("ownedChannels") &&
                    relations.push("mutedChannels") &&
                    relations.push("bannedChannels");
            }
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
            found = await this.UserRepository.findOne({
                where: { display_name: id },
                relations,
            });
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
        return res.sendFile((await this.getUserId(id)).avatar, { root: "./image" });
    }
    async saveUser(user) {
        await this.UserRepository.save(user);
        return true;
    }
    async getWhoFollowMe(id) {
        const users = (await this.getUsers([{ withFriends: true }])).filter((user) => user.id !== id);
        const whoFollowMe = [];
        for (const user of users) {
            if (user.friends.find((f) => f.id === id))
                whoFollowMe.push(await this.getUserId(user.id));
        }
        return whoFollowMe;
    }
    async getWhoBlockMe(id) {
        const users = (await this.getUsers([{ withBlocked: true }])).filter((user) => user.id !== id);
        const whoBlockMe = [];
        for (const user of users) {
            if (user.blockedUsers.find((f) => f.id === id))
                whoBlockMe.push(await this.getUserId(user.id));
        }
        return whoBlockMe;
    }
    async createUsers(authCredentialsDto) {
        const { FortyTwoID, user_name, first_name, last_name } = authCredentialsDto;
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
            matchs: [],
            win: 0,
            loose: 0,
            rank: 0,
            ratio: 1,
            First_time: true,
            avatar: "default.png" + "?" + new Date().getTime(),
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
        const found = await this.getUserId(id, [
            { withFriends: true },
            { withBlocked: true },
        ]);
        const friend = await this.getUserId(friend_id, [{ withBlocked: true }]);
        if (!found.friends)
            found.friends = [];
        if (friend.blockedUsers.find((f) => f.id === found.id))
            throw new common_1.ConflictException(`You are blocked by \`${friend_id}'`);
        if (found.friends.find((f) => f.id == friend.id))
            throw new common_1.ConflictException("Already friend");
        if (found.blockedUsers.find((f) => f.id === friend.id))
            throw new common_1.ConflictException(`You are blocked \`${friend_id}'`);
        found.friends.push(friend);
        await this.UserRepository.save(found);
        return friend;
    }
    async addBlocked(id, blockedUsersId) {
        if ((await this.getUserId(blockedUsersId)) === (await this.getUserId(id)))
            throw new common_1.BadRequestException("You can't block yourself");
        const found = await this.getUserId(id, [
            { withBlocked: true },
            { withFriends: true },
        ]);
        const blockedUser = await this.getUserId(blockedUsersId, [
            { withFriends: true },
        ]);
        if (!found.blockedUsers)
            found.blockedUsers = [];
        if (found.blockedUsers.find((f) => f.id == blockedUser.id))
            throw new common_1.ConflictException("Already blocked");
        found.blockedUsers.push(blockedUser);
        await this.UserRepository.save(found);
        if (found.friends.find((f) => f.id == blockedUser.id))
            this.removeFriend(id, blockedUsersId);
        if (blockedUser.friends.find((f) => f.id == found.id))
            this.removeFriend(blockedUsersId, id);
        return blockedUser;
    }
    async uploadFile(id, file) {
        const response = {
            filename: file.filename,
        };
        const split = id.avatar.split("?");
        const name = split[split.length - 2];
        const extfile = (0, path_1.extname)(name);
        if (extfile != (0, path_1.extname)(file.filename)) {
            id.avatar = name;
            this.deleteAvatarID(id);
        }
        id.avatar = file.filename + "?" + new Date().getTime();
        await this.UserRepository.save(id);
        return response;
    }
    async deleteUser(id) {
        const found = await this.getUserId(id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        const target = await this.UserRepository.delete(found.id);
        if (target.affected === 0)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return true;
    }
    async deleteAvatar(id) {
        const found = await this.getUserId(id);
        if (found.avatar == "default.png")
            return false;
        try {
            fs.unlinkSync("image/" + found.avatar);
        }
        catch (err) { }
        found.avatar = "default.png";
        await this.UserRepository.save(found);
        return true;
    }
    async deleteAvatarID(user) {
        if (user.avatar == "default.png")
            return false;
        try {
            fs.unlinkSync("image/" + user.avatar);
        }
        catch (err) { }
        user.avatar = "default.png";
        await this.UserRepository.save(user);
        return true;
    }
    async removeFriend(id, friend_id) {
        const user = await this.getUserId(id, [{ withFriends: true }]);
        if (!user.friends || !user.friends.length)
            throw new common_1.NotFoundException(`User \`${id}' has no friends`);
        const friend = await this.getUserId(friend_id);
        if (!user.friends.find((f) => f.id == friend.id))
            throw new common_1.NotFoundException(`User \`${id}' has no friend \`${friend_id}'`);
        user.friends = user.friends.filter((f) => f.id != friend.id);
        await this.UserRepository.save(user);
        return friend;
    }
    async removeBlocked(id, blockedUserId) {
        const user = await this.getUserId(id, [{ withBlocked: true }]);
        if (!user.blockedUsers || !user.blockedUsers.length)
            throw new common_1.NotFoundException(`User \`${id}' has no blocked users`);
        const blockedUser = await this.getUserId(blockedUserId);
        if (!user.blockedUsers.find((f) => f.id == blockedUser.id))
            throw new common_1.NotFoundException(`User \`${user.user_name}' has no blocked user \`${blockedUser.user_name}'`);
        user.blockedUsers = user.blockedUsers.filter((f) => f.id != blockedUser.id);
        await this.UserRepository.save(user);
        return blockedUser;
    }
    async patchUser(id, body) {
        const { firstname, lastname, display_name, email, status, ingame, win, loose, rank, ratio, TwoFA, } = body;
        const found = await this.getUserId(id);
        if (firstname)
            found.first_name = firstname;
        if (lastname)
            found.last_name = lastname;
        if (display_name)
            found.display_name = display_name;
        if (TwoFA != null)
            found.TwoFA = TwoFA;
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
        await this.UserRepository.save(found);
        return found;
    }
    async patchUpdateRank() {
        const found = await this.getRankedUsers();
        for (let i = 0; i < found.length; i++) {
            found[i].rank = i + 1;
            await this.UserRepository.save(found[i]);
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
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => matchs_service_1.MatchsService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        matchs_service_1.MatchsService,
        jwt_1.JwtService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map