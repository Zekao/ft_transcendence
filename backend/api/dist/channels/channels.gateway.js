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
const users_enum_1 = require("../users/users.enum");
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
    async connectToSocket(client, msg) {
        try {
            const message = client.data.user.user_name + ": " + msg;
            console.log(client.data.ConnectedChannel);
            this.emitChannel(client.data, "Hello", message);
        }
        catch (_a) { }
    }
    emitChannel(channel, event, ...args) {
        try {
            if (!channel.user)
                return;
            const sockets = Array.from(this.server.sockets.sockets.values());
            sockets.forEach((socket) => {
                if (channel.ConnectedChannel == socket.data.ConnectedChannel)
                    socket.emit(event, ...args);
            });
        }
        catch (_a) { }
    }
    handleDisconnect(client) {
        const user = client.data.user;
        console.log(user);
        if (client.data.status) {
            user.status = users_enum_1.UserStatus.OFFLINE;
            this.userService.saveUser(user);
        }
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleConnection(client, ...args) {
        try {
            const user = await this.authService.getUserFromSocket(client);
            const allchanel = await this.channelService.getChannel();
            client.data.user = user;
            client.data.status = client.handshake.headers.status;
            console.log(client.data.status);
            if (client.data.status) {
                console.log("aa");
                user.status = users_enum_1.UserStatus.ONLINE;
                this.userService.saveUser(user);
                return;
            }
            client.data.ConnectedChannel = client.handshake.headers.channel;
            if (!client.data.ConnectedChannel)
                throw new common_1.UnauthorizedException("You must specify a channel");
            client.emit("info", { user, allchanel });
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
], ChannelsGateway.prototype, "connectToSocket", null);
ChannelsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        auth_services_1.AuthService,
        channels_service_1.ChannelsService])
], ChannelsGateway);
exports.ChannelsGateway = ChannelsGateway;
//# sourceMappingURL=channels.gateway.js.map