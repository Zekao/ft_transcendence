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
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_service_1 = require("../users/users.service");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const channels_entity_1 = require("./channels.entity");
let ChannelsService = class ChannelsService {
    constructor(ChannelsRepository, UsersService) {
        this.ChannelsRepository = ChannelsRepository;
        this.UsersService = UsersService;
    }
    async getChannel() {
        const channel = await this.ChannelsRepository.find();
        if (!channel)
            throw new common_1.NotFoundException(`Channel not found`);
        return channel;
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
    async getChannelId(id) {
        let found = null;
        if ((0, utils_1.isUuid)(id))
            found = await this.ChannelsRepository.findOne({ where: { id: id } });
        else
            found = await this.ChannelsRepository.findOne({ where: { name: id } });
        if (!found)
            throw new common_1.NotFoundException(`Channel \`${id}' not found`);
        return found;
    }
    async getChannelPermissions(id) {
        const found = await this.getChannelId(id);
        if (!found)
            throw new common_1.NotFoundException(`Channel \`${id}' not found`);
        return found.permissions;
    }
    async getChannelStatus(id) {
        const found = await this.getChannelId(id);
        if (!found)
            throw new common_1.NotFoundException(`Channel \`${id}' not found`);
        return found.status;
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
    async createChannel(channelsDto, channelPasswordDto) {
        const { name, status, permissions } = channelsDto;
        const { password } = channelPasswordDto;
        const channel = this.ChannelsRepository.create({
            name,
            status,
            permissions,
            password,
        });
        try {
            await this.ChannelsRepository.save(channel);
        }
        catch (error) {
            if (error.code == "23505") {
                throw new common_1.ConflictException("Channel already exist");
            }
            else {
                console.log(error);
                throw new common_1.InternalServerErrorException();
            }
        }
        return channel;
    }
    async deleteChannel(id) {
        const found = await this.getChannelId(id);
        if (!found)
            throw new common_1.NotFoundException(`Channel \`${id}' not found`);
        const target = await this.ChannelsRepository.delete(found);
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