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
const users_service_1 = require("../users/users.service");
const auth_services_1 = require("../auth/auth.services");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    constructor(authService, chatService, userService) {
        this.authService = authService;
        this.chatService = chatService;
        this.userService = userService;
        this.logger = new common_1.Logger("ChatGateway");
    }
    afterInit(server) {
        this.logger.log("Init");
    }
    async SendPrivateMessage(client, msg) {
        try {
            client.data.chat = await this.chatService.FindTwoChat(client.data.user.id, client.data.receiver.id);
            const chat = client.data.chat;
            const login = client.data.user.display_name;
            const history = { login, message: msg };
            chat.history.push(history);
            this.chatService.saveChat(chat);
            this.emitChat(client.data, "msg", login, msg);
        }
        catch (_a) { }
    }
    emitChat(channel, event, ...args) {
        try {
            if (!channel.user)
                return;
            const sockets = Array.from(this.server.sockets.values());
            sockets.forEach((socket) => {
                if (channel.chat.id === socket.data.chat.id)
                    socket.emit(event, ...args);
            });
        }
        catch (_a) { }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async isMsg(client) {
        client.data.receiver = client.handshake.auth.msg;
        if (client.data.receiver) {
            client.data.receiver = await this.userService.getUserId(client.data.receiver);
            try {
                client.data.chat = await this.chatService.FindTwoChat(client.data.user.id, client.data.receiver.id);
            }
            catch (err) {
                client.data.chat = await this.chatService.createChat(client.data.user, client.data.receiver);
            }
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
    __metadata("design:paramtypes", [auth_services_1.AuthService,
        chat_service_1.ChatService,
        users_service_1.UsersService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map