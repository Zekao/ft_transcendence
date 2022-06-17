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
exports.StatusGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const auth_services_1 = require("../auth/auth.services");
const channels_service_1 = require("./channels.service");
const users_enum_1 = require("../users/users.enum");
let StatusGateway = class StatusGateway {
    constructor(jwtService, userService, authService, channelService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.authService = authService;
        this.channelService = channelService;
        this.logger = new common_1.Logger("StatusGateway");
    }
    afterInit(server) {
        this.logger.log("Init");
    }
    async SendMessageToChannel(client, message) {
        try {
            const user = client.data.user;
            if (message[0] === "invite") {
                if (message[1]) {
                    const invited = await this.userService.getUserId(message[1]);
                    console.log(message);
                    client.emit("notification", invited.user_name, "game", "GAME-ID");
                }
            }
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
    async handleDisconnect(client) {
        if (client.data.user) {
            const user = await this.userService.getUserId(client.data.user.id);
            user.status = users_enum_1.UserStatus.OFFLINE;
            this.userService.saveUser(user);
        }
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    isStatus(client, user) {
        user.status = users_enum_1.UserStatus.ONLINE;
        this.userService.saveUser(user);
        this.logger.log(`Client connected: ${client.id}`);
        return true;
    }
    async handleConnection(client, ...args) {
        try {
            const user = await this.authService.getUserFromSocket(client);
            client.data.user = user;
            if (this.isStatus(client, user))
                return;
        }
        catch (err) {
            return client.disconnect();
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], StatusGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("notification"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], StatusGateway.prototype, "SendMessageToChannel", null);
StatusGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        auth_services_1.AuthService,
        channels_service_1.ChannelsService])
], StatusGateway);
exports.StatusGateway = StatusGateway;
//# sourceMappingURL=status.gateway.js.map