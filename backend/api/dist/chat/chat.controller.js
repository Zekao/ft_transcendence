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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guard/jwt.auth.guard");
const users_service_1 = require("../users/users.service");
const chat_service_1 = require("./chat.service");
let ChatController = class ChatController {
    constructor(chatService, usersService) {
        this.chatService = chatService;
        this.usersService = usersService;
    }
    async GetHistoryMessage(id, req) {
        const user = await this.usersService.getUserId(id);
        const chat = await this.chatService.FindTwoChat(user.id, req.user.id);
        return this.chatService.getHistory(chat);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/me/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Return list of all message about specified id",
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "GetHistoryMessage", null);
ChatController = __decorate([
    (0, swagger_1.ApiTags)("chat"),
    (0, common_1.Controller)("chat"),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        users_service_1.UsersService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map