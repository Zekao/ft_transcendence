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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const utils_1 = require("../utils/utils");
const chat_entity_1 = require("./chat.entity");
let ChatService = class ChatService {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async GetMessage() {
        const message = await this.chatRepository.find();
        if (!message)
            throw new common_1.NotFoundException(`Message not found`);
        return message;
    }
    async GetMessageID(id) {
        let found = null;
        if ((0, utils_1.isUuid)(id))
            found = await this.chatRepository.findOne({
                where: { id: id },
            });
        if (!found)
            throw new common_1.NotFoundException(`Chat \`${id}' not found`);
        return found;
    }
    async FindTwoChat(id, id2) {
        let found = null;
        if ((0, utils_1.isUuid)(id) && (0, utils_1.isUuid)(id2))
            found = await this.chatRepository.findOne({
                where: { first: id, second: id2 },
            });
        if (!found)
            throw new common_1.NotFoundException(`Chat \`${id}' not found`);
        return found;
    }
    async getHistory(chat) {
        return chat.history;
    }
    async createChat(user) {
        const chat = this.chatRepository.create({
            first: user.id,
            history: [],
        });
        try {
            await this.chatRepository.save(chat);
        }
        catch (error) {
            if (error.code == "23505") {
                throw new common_1.ConflictException("Chat already exist");
            }
            else {
                console.log(error);
                throw new common_1.InternalServerErrorException();
            }
        }
        return chat;
    }
    async addParticipant(chat, user) {
        try {
            chat.second = user.id;
            await this.chatRepository.save(chat);
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException();
        }
        return chat;
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map