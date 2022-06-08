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
exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const channels_service_1 = require("./channels.service");
const channels_filter_dto_1 = require("./dto/channels-filter.dto");
const channels_dto_1 = require("./dto/channels.dto");
let ChannelsController = class ChannelsController {
    constructor(channelService) {
        this.channelService = channelService;
    }
    getUsers(filters) {
        if (Object.keys(filters).length)
            return this.channelService.getChannelByFilter(filters);
        return this.channelService.getChannel();
    }
    getChannelStatus(id) {
        return this.channelService.getChannelStatus(id);
    }
    getChannelPermission(id) {
        return this.channelService.getChannelPermissions(id);
    }
    createChannel(ChannelsDtos) {
        return this.channelService.createChannel(ChannelsDtos);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channels_filter_dto_1.ChannelFilteDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)("/:id/status"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getChannelStatus", null);
__decorate([
    (0, common_1.Get)("/:id/permission"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getChannelPermission", null);
__decorate([
    (0, common_1.Post)("/create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channels_dto_1.ChannelsDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createChannel", null);
ChannelsController = __decorate([
    (0, common_1.Controller)("channel"),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService])
], ChannelsController);
exports.ChannelsController = ChannelsController;
//# sourceMappingURL=channels.controller.js.map