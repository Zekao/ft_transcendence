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
                relation.withMuted && relations.push("muted");
                relation.withBanned && relations.push("banned");
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
        const { role, id } = Role;
        var relations = [];
        if (role) {
            if (role === "all")
                relations.push({ withAllMembers: true });
            if (role === "members")
                relations.push({ withMembersOnly: true });
            if (role === "admins")
                relations.push({ withAdminOnly: true });
            if (role === "owner")
                relations.push({ withOwnerOnly: true });
            if (role === "muted")
                relations.push({ withMuted: true });
            if (role === "banned")
                relations.push({ withBanned: true });
        }
        else {
            relations.push({ withAllMembers: true });
        }
        const channel = await this.getChannelId(channelId, relations);
        console.log(channel);
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
        });
        channel.owner = owner;
        await this.ChannelsRepository.save(channel);
        console.log((await this.getChannelId(channel.id, [{ withAllMembers: true }])));
        return channel;
    }
    async validateChannelPassword(id, channelPasswordDto) {
        const found = await this.getChannelId(id);
        const { password } = channelPasswordDto;
        if (!(await bcrypt.compare(password, found.password)))
            throw new common_1.ForbiddenException("Incorrect Password");
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
        const { name, status, permissions } = ChannelDto;
        const found = await this.getChannelId(id);
        if (name)
            found.name = name;
        if (status)
            found.status = status;
        if (permissions)
            found.permissions = permissions;
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