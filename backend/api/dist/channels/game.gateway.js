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
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const auth_services_1 = require("../auth/auth.services");
const channels_service_1 = require("./channels.service");
const users_enum_1 = require("../users/users.enum");
let GameGateway = class GameGateway {
    constructor(jwtService, userService, authService, channelService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.authService = authService;
        this.channelService = channelService;
        this.logger = new common_1.Logger("GameGateway");
    }
    afterInit(server) {
        this.logger.log("Init");
    }
    async gamecontrol(client, message) {
        try {
            console.log("dddd");
            this.emitChannel(client.data, "channel", message);
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
        if (client.data.game) {
            user.in_game = users_enum_1.UserGameStatus.OUT_GAME;
            this.userService.saveUser(user);
        }
        console.log("OUT GAME");
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    isInGame(client, user) {
        client.data.game = client.handshake.headers.game;
        if (client.data.game) {
            user.in_game = users_enum_1.UserGameStatus.IN_GAME;
            this.userService.saveUser(user);
            console.log("IN_GAME");
            this.logger.log(`Client connected: ${client.id}`);
            return true;
        }
        return false;
    }
    async handleConnection(client, ...args) {
        try {
            const user = await this.authService.getUserFromSocket(client);
            client.data.user = user;
            if (this.isInGame(client, user))
                return;
            throw new common_1.UnauthorizedException("You must specify a channel, or msg");
        }
        catch (err) {
            return client.disconnect();
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("move"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "gamecontrol", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: "game" }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        auth_services_1.AuthService,
        channels_service_1.ChannelsService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map