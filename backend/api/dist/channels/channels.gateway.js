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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const auth_services_1 = require("../auth/auth.services");
const channels_service_1 = require("./channels.service");
let ChannelsGateway = class ChannelsGateway {
    constructor(jwtService, userService, authService, channelService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.authService = authService;
        this.channelService = channelService;
        this.logger = new common_1.Logger("ChannelsGateway");
    }
    afterInit(server) {
        this.logger.log("Init");
    }
    async getChannel(client, id) {
        try {
            const channel = await this.channelService.getChannelId(id);
            console.log("fddf");
            client.emit("channel", channel);
        }
        catch (_a) { }
    }
    async getChannelMe(client) {
        try {
            client.emit('MyChannel', "chann info");
        }
        catch (_a) { }
    }
    emitChannel(channel, event, ...args) {
        try {
            if (!channel.users)
                return;
            const sockets = Array.from(this.server.sockets.values());
            sockets.forEach((socket) => {
                if (channel.users.find((user) => user.id == socket.data.user.id))
                    socket.emit(event, ...args);
            });
        }
        catch (_a) { }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleConnection(client, ...args) {
        try {
            const user = await this.authService.getUserIDFromSocket(client);
            const allchan = await this.channelService.getChannel();
            client.data.user = user;
            client.emit("info", { user, allchan });
            this.logger.log(`Client connected: ${client.id}`);
        }
        catch (err) {
            return client.disconnect();
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], ChannelsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("channel"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], ChannelsGateway.prototype, "getChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("MyChannel"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChannelsGateway.prototype, "getChannelMe", null);
ChannelsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        auth_services_1.AuthService,
        channels_service_1.ChannelsService])
], ChannelsGateway);
exports.ChannelsGateway = ChannelsGateway;
//# sourceMappingURL=channels.gateway.js.map