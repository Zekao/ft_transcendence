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
exports.ChannelsService = exports.ChannelRelationsPicker = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_service_1 = require("../users/users.service");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const channels_entity_1 = require("./channels.entity");
const channels_enum_1 = require("./channels.enum");
const bcrypt = require("bcrypt");
class ChannelRelationsPicker {
}
exports.ChannelRelationsPicker = ChannelRelationsPicker;
let ChannelsService = class ChannelsService {
    constructor(ChannelsRepository, UsersService) {
        this.ChannelsRepository = ChannelsRepository;
        this.UsersService = UsersService;
    }
    async getChannel(StatusDto) {
        if (StatusDto)
            var { status } = StatusDto;
        var channels = await this.ChannelsRepository.find();
        if (!channels)
            throw new common_1.NotFoundException(`Channel not found`);
        if (status && status === channels_enum_1.ChannelStatus.PRIVATE)
            channels = channels.filter((channel) => channel.status === channels_enum_1.ChannelStatus.PRIVATE);
        else if (status && status === channels_enum_1.ChannelStatus.PUBLIC)
            channels = channels.filter((channel) => channel.status === channels_enum_1.ChannelStatus.PUBLIC);
        else if (status && status === channels_enum_1.ChannelStatus.PROTECTED)
            channels = channels.filter((channel) => channel.status === channels_enum_1.ChannelStatus.PROTECTED);
        return channels;
    }
    async getChannelByFilter(filter) {
        const { name, permissions, status } = filter;
        let channels = await this.getChannel();
        if (name)
            channels = channels.filter((channel) => channel.name === name);
        if (status)
            channels = channels.filter((channel) => channel.status === status);
        if (permissions)
            channels = channels.filter((channel) => channel.permissions === permissions);
        if (!channels)
            throw new common_1.NotFoundException(`Channel not found`);
        return channels;
    }
    async getChannelId(id, RelationsPicker) {
        const relations = [];
        if (RelationsPicker) {
            for (const relation of RelationsPicker) {
                relation.withAllMembers &&
                    relations.push("members") &&
                    relations.push("admins") &&
                    relations.push("owner");
                relation.withMembersOnly && relations.push("members");
                relation.withAdminOnly && relations.push("admins");
                relation.withOwnerOnly && relations.push("owner");
                relation.withMuted && relations.push("mutedUsers");
                relation.withBanned && relations.push("bannedUsers");
            }
        }
        let found = null;
        if ((0, utils_1.isUuid)(id))
            found = await this.ChannelsRepository.findOne({
                where: { id: id },
                relations,
            });
        else
            found = await this.ChannelsRepository.findOne({
                where: { name: id },
                relations,
            });
        if (!found)
            throw new common_1.NotFoundException(`Channel \`${id}' not found`);
        return found;
    }
    async getChannelMembers(channelId, Role) {
        if (Role)
            var { role, id } = Role;
        var relations = [];
        if (role) {
            if (role === "all")
                relations.push({ withAllMembers: true });
            if (role === "member")
                relations.push({ withMembersOnly: true });
            if (role === "admin")
                relations.push({ withAdminOnly: true });
            if (role === "owner")
                relations.push({ withOwnerOnly: true });
            if (role === "muted")
                relations.push({ withMuted: true });
            if (role === "ban")
                relations.push({ withBanned: true });
        }
        else {
            relations.push({ withAllMembers: true });
        }
        const channel = await this.getChannelId(channelId, relations);
        var users = [];
        if (channel.members) {
            for (const member of channel.members)
                users.push(member);
        }
        if (channel.admins) {
            for (const admin of channel.admins)
                users.push(admin);
        }
        if (channel.owner) {
            users.push(channel.owner);
        }
        if (channel.mutedUsers) {
            for (const muted of channel.mutedUsers)
                users.push(muted);
        }
        if (channel.bannedUsers) {
            for (const banned of channel.bannedUsers)
                users.push(banned);
        }
        return users;
    }
    async getChannelBanMembers(channelId) {
        const found = await this.getChannelId(channelId, [{ withBanned: true }]);
        if (found.bannedUsers == null)
            return [];
        return found.bannedUsers;
    }
    async getChannelHistory(id) {
        const found = await this.getChannelId(id);
        if (!found)
            throw new common_1.NotFoundException(`Channel \`${id}' not found`);
        return found.history;
    }
    async saveChannel(id) {
        this.ChannelsRepository.save(id);
        return true;
    }
    async createChannel(id, channelsDto) {
        const owner = await this.UsersService.getUserId(id);
        const { name, status, permissions, password } = channelsDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const channel = this.ChannelsRepository.create({
            name,
            status,
            permissions,
            password: hashedPassword,
            owner: owner,
        });
        await this.ChannelsRepository.save(channel);
        return channel;
    }
    async validateChannelPassword(id, channelPasswordDto) {
        const found = await this.getChannelId(id);
        const { password } = channelPasswordDto;
        if (!(await bcrypt.compare(password, found.password)))
            throw new common_1.ForbiddenException("Incorrect Password");
        return found;
    }
    async addUserToMember(me, channelId, channelMembers) {
        const { user } = channelMembers;
        if (user)
            me = user;
        const found = await this.UsersService.getUserId(me);
        const channel = await this.getChannelId(channelId, [{ withAllMembers: true }, { withBanned: true }]);
        if ((await this.getChannelMembers(channelId)).find((user) => user.id === found.id))
            throw new common_1.ConflictException(`User ${me} is already in channel`);
        if ((await this.getChannelBanMembers(channelId)).find((user) => user.id === found.id))
            throw new common_1.ConflictException(`User ${me} is banned from this channel`);
        channel.members.push(found);
        await this.ChannelsRepository.save(channel);
        return found;
    }
    async addUserToAdmin(me, channelId, channelMembers) {
        const { user } = channelMembers;
        if (user)
            me = user;
        const found = await this.UsersService.getUserId(me);
        const channel = await this.getChannelId(channelId, [{ withAllMembers: true }, { withBanned: true }, { withMuted: true }]);
        if (!(await this.getChannelMembers(channelId)).find((user) => user.id === found.id))
            throw new common_1.ForbiddenException(`User ${me} has not in channel`);
        if (channel.owner.id === found.id)
            throw new common_1.ConflictException(`User ${me} is owner of this channel`);
        if (channel.admins.find((admin) => admin.id === found.id))
            throw new common_1.ConflictException(`User ${me} is admin of this channel`);
        channel.members = channel.members.filter((member) => member.id !== found.id);
        channel.admins.push(found);
        if (channel.mutedUsers.find((muted) => muted.id === found.id))
            channel.mutedUsers = channel.mutedUsers.filter((muted) => muted.id !== found.id);
        await this.ChannelsRepository.save(channel);
        return found;
    }
    async addUserToMuted(me, channelId, channelMembers) {
        const { user } = channelMembers;
        if (user)
            me = user;
        const found = await this.UsersService.getUserId(me);
        const channel = await this.getChannelId(channelId, [{ withAllMembers: true }, { withBanned: true }, { withMuted: true }]);
        if (!(await this.getChannelMembers(channelId)).find((user) => user.id === found.id))
            throw new common_1.ForbiddenException(`User ${me} has not in channel`);
        if (channel.owner.id === found.id)
            throw new common_1.ConflictException(`User ${me} is owner of this channel`);
        if (channel.admins.find((admin) => admin.id === found.id))
            throw new common_1.ConflictException(`User ${me} is admin of this channel`);
        if (channel.mutedUsers.find((muted) => muted.id === found.id))
            throw new common_1.ConflictException(`User ${me} already muted`);
        channel.mutedUsers.push(found);
        await this.ChannelsRepository.save(channel);
        return found;
    }
    async addUserToBanned(me, channelId, channelMembers) {
        const { user } = channelMembers;
        if (user)
            me = user;
        const found = await this.UsersService.getUserId(me);
        const channel = await this.getChannelId(channelId, [{ withAllMembers: true }, { withBanned: true }, { withMuted: true }]);
        if ((await this.getChannelBanMembers(channelId)).find((user) => user.id === found.id))
            throw new common_1.ConflictException(`User ${me} already banned`);
        if (channel.owner.id === found.id)
            throw new common_1.ConflictException(`User ${me} is owner of this channel`);
        if (channel.admins.find((admin) => admin.id === found.id))
            throw new common_1.ConflictException(`User ${me} is admin of this channel`);
        channel.bannedUsers.push(found);
        if (channel.mutedUsers.find((muted) => muted.id === found.id))
            channel.mutedUsers = channel.mutedUsers.filter((muted) => muted.id !== found.id);
        channel.members = channel.members.filter((member) => member.id !== found.id);
        await this.ChannelsRepository.save(channel);
        return found;
    }
    async deleteChannel(id) {
        const found = await this.getChannelId(id);
        if (!found)
            throw new common_1.NotFoundException(`Channel \`${id}' not found`);
        const target = await this.ChannelsRepository.delete(found.id);
        if (target.affected === 0)
            throw new common_1.NotFoundException(`Channel \`${id}' not found`);
        return true;
    }
    async editChannel(id, ChannelDto) {
        const { name, status, permissions, password } = ChannelDto;
        const found = await this.getChannelId(id);
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        if (name)
            found.name = name;
        if (status)
            found.status = status;
        if (permissions)
            found.permissions = permissions;
        if (password)
            found.password = hashedPassword;
        await this.ChannelsRepository.save(found);
        return found;
    }
};
ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channels_entity_1.Channel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], ChannelsService);
exports.ChannelsService = ChannelsService;
//# sourceMappingURL=channels.service.js.map