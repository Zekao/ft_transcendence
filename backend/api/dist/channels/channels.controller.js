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
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guard/jwt.auth.guard");
const channels_service_1 = require("./channels.service");
const channels_filter_dto_1 = require("./dto/channels-filter.dto");
const channels_dto_1 = require("./dto/channels.dto");
let ChannelsController = class ChannelsController {
    constructor(channelService) {
        this.channelService = channelService;
    }
    GetAllChannel(filters) {
        if (Object.keys(filters).length)
            return this.channelService.getChannelByFilter(filters);
        return this.channelService.getChannel();
    }
    getChannelMembers(id, query) {
        console.log(query);
        return this.channelService.getChannelMembers(id, query);
    }
    getChannel(id) {
        return this.channelService.getChannelId(id);
    }
    getHistory(id) {
        return this.channelService.getChannelHistory(id);
    }
    getChannelPassword(id, body) {
        return this.channelService.validateChannelPassword(id, body);
    }
    createChannel(req, ChannelsDtos) {
        return this.channelService.createChannel(req.user.id, ChannelsDtos);
    }
    deleteUser(id) {
        return this.channelService.deleteChannel(id);
    }
    editChannel(id, edit) {
        return this.channelService.editChannel(id, edit);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Return list of all existing channels" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channels_filter_dto_1.ChannelFilteDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "GetAllChannel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/:id/members"),
    (0, swagger_1.ApiOperation)({ summary: "Return list of all members of channel" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getChannelMembers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Get channel info",
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getChannel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/:id/history"),
    (0, swagger_1.ApiOperation)({
        summary: "Get message history of a channel",
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("/:id/password"),
    (0, swagger_1.ApiOperation)({
        summary: "Validate password of a channel",
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getChannelPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("/create"),
    (0, swagger_1.ApiOperation)({
        summary: "Create a new channel",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, channels_dto_1.ChannelsDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Delete)("/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Delete a specified channel",
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Patch)("/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Modify attribute of a specified channel",
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, channels_dto_1.ChannelsDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "editChannel", null);
ChannelsController = __decorate([
    (0, swagger_1.ApiTags)("channel"),
    (0, common_1.Controller)("channel"),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService])
], ChannelsController);
exports.ChannelsController = ChannelsController;
//# sourceMappingURL=channels.controller.js.map