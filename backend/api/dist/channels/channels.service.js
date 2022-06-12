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
const typeorm_2 = require("typeorm");
const channels_entity_1 = require("./channels.entity");
function isChannel(id) {
    const splited = id.split("-");
    return (id.length === 36 &&
        splited.length === 5 &&
        splited[0].length === 8 &&
        splited[1].length === 4 &&
        splited[2].length === 4 &&
        splited[3].length === 4 &&
        splited[4].length === 12);
}
let ChannelsService = class ChannelsService {
    constructor(ChannelsRepository) {
        this.ChannelsRepository = ChannelsRepository;
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
        if (isChannel(id))
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
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChannelsService);
exports.ChannelsService = ChannelsService;
//# sourceMappingURL=channels.service.js.map