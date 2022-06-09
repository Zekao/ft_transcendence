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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const authentication_service_1 = require("../authentication/authentication.service");
const cookie_1 = require("cookie");
const websockets_1 = require("@nestjs/websockets");
const typeorm_1 = require("@nestjs/typeorm");
const message_entity_1 = require("../message/message.entity");
const typeorm_2 = require("typeorm");
let ChatService = class ChatService {
    constructor(authenticationService, messagesRepository) {
        this.authenticationService = authenticationService;
        this.messagesRepository = messagesRepository;
    }
    async getUserFromSocket(socket) {
        const cookie = socket.handshake.headers.cookie;
        const { Authentication: authenticationToken } = (0, cookie_1.parse)(cookie);
        const user = await this.authenticationService.getUserFromAuthenticationToken(authenticationToken);
        if (!user) {
            throw new websockets_1.WsException("Invalid credentials.");
        }
        return user;
    }
    async saveMessage(content, author) {
        const newMessage = await this.messagesRepository.create({
            content,
            author,
        });
        await this.messagesRepository.save(newMessage);
        return newMessage;
    }
    async getAllMessages() {
        return this.messagesRepository.find({
            relations: ["author"],
        });
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.default)),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService,
        typeorm_2.Repository])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map