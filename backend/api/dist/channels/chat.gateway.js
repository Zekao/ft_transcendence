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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const auth_services_1 = require("../auth/auth.services");
const channels_service_1 = require("./channels.service");
let ChatGateway = class ChatGateway {
    constructor(jwtService, userService, authService, channelService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.authService = authService;
        this.channelService = channelService;
        this.logger = new common_1.Logger("ChatGateway");
    }
    afterInit(server) {
        this.logger.log("Init");
    }
    async SendPrivateMessage(client, msg) {
        try {
            const message = client.data.user.display_name + ": " + msg;
            this.emitChannel(client.data, "msg", message);
        }
        catch (_a) { }
    }
    emitChannel(channel, event, ...args) {
        try {
            if (!channel.user)
                return;
            const sockets = Array.from(this.server.sockets.values());
            sockets.forEach((socket) => {
                if (channel.ConnectedChannel == socket.data.ConnectedChannel)
                    socket.emit(event, ...args);
            });
        }
        catch (_a) { }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    isMsg(client) {
        client.data.msg = client.handshake.query.msg;
        if (client.data.msg) {
            this.logger.log(`Client connected: ${client.id}`);
            return true;
        }
        return false;
    }
    async handleConnection(client, ...args) {
        try {
            const user = await this.authService.getUserFromSocket(client);
            client.data.user = user;
            if (this.isMsg(client))
                return;
            throw new common_1.UnauthorizedException("You must specify a chat");
        }
        catch (err) {
            return client.disconnect();
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("msg"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "SendPrivateMessage", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: "chat" }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        auth_services_1.AuthService,
        channels_service_1.ChannelsService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map