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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const user_filter_dto_1 = require("./dto/user-filter.dto");
const users_service_1 = require("./users.service");
const multer_1 = require("multer");
const file_upload_utils_1 = require("./file-upload.utils");
let UsersController = class UsersController {
    constructor(UsersService) {
        this.UsersService = UsersService;
    }
    getUsers(filters) {
        if (Object.keys(filters).length)
            return this.UsersService.getUserByFilter(filters);
        return this.UsersService.getUsers();
    }
    getRankedUsers() {
        return this.UsersService.getRankedUsers();
    }
    getUserId(id) {
        return this.UsersService.getUserId(id);
    }
    getFirstName(id) {
        return this.UsersService.getFirstName(id);
    }
    getLastName(id) {
        return this.UsersService.getLastName(id);
    }
    getUserName(id) {
        return this.UsersService.getUserName(id);
    }
    getEmail(id) {
        return this.UsersService.getEmail(id);
    }
    getStatus(id) {
        return this.UsersService.getStatus(id);
    }
    getInGame(id) {
        return this.UsersService.getGameStatus(id);
    }
    getWin(id) {
        return this.UsersService.getWin(id);
    }
    getLoose(id) {
        return this.UsersService.getLoose(id);
    }
    getRank(id) {
        return this.UsersService.getRank(id);
    }
    getRatio(id) {
        return this.UsersService.getRatio(id);
    }
    getAvatar(id, res) {
        return this.UsersService.getAvatar(id, res);
    }
    getAvatarPath(id) {
        return this.UsersService.getAvatarPath(id);
    }
    async uploadedFile(id, file) {
        return this.UsersService.uploadFile(id, file);
    }
    deleteUser(id) {
        return this.UsersService.deleteUser(id);
    }
    deleteAvatar(id) {
        return this.UsersService.deleteAvatar(id);
    }
    patchFirstName(id, query) {
        return this.UsersService.patchFirstName(id, query.firstname);
    }
    patchLastName(id, query) {
        return this.UsersService.patchLastName(id, query.lastname);
    }
    patchUserName(id, query) {
        return this.UsersService.patchUserName(id, query.username);
    }
    patchEmail(id, query) {
        return this.UsersService.patchEmail(id, query.email);
    }
    patchStatus(id, query) {
        return this.UsersService.patchStatus(id, query);
    }
    patchGameStatus(id, query) {
        return this.UsersService.patchUserGameStatus(id, query);
    }
    patchWin(id, query) {
        return this.UsersService.patchWin(id, query);
    }
    patchLoose(id, query) {
        return this.UsersService.patchLoose(id, query);
    }
    patchRank(id, query) {
        return this.UsersService.patchRank(id, query);
    }
    patchAddWin(id) {
        return this.UsersService.patchAddWin(id);
    }
    patchAddLoose(id) {
        return this.UsersService.patchAddLoose(id);
    }
    patchRemoveWin(id) {
        return this.UsersService.patchRemoveWin(id);
    }
    patchRemoveLoose(id) {
        return this.UsersService.patchRemoveLoose(id);
    }
    patchUpdateRatio(id) {
        return this.UsersService.patchUpdateRatio(id);
    }
    patchUpdateRank() {
        return this.UsersService.patchUpdateRank();
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_filter_dto_1.UsersFiltesDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)("/ranklist"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRankedUsers", null);
__decorate([
    (0, common_1.Get)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserId", null);
__decorate([
    (0, common_1.Get)("/:id/firstname"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFirstName", null);
__decorate([
    (0, common_1.Get)("/:id/lastname"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getLastName", null);
__decorate([
    (0, common_1.Get)("/:id/username"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserName", null);
__decorate([
    (0, common_1.Get)("/:id/email"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getEmail", null);
__decorate([
    (0, common_1.Get)("/:id/status"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)("/:id/gameStatus"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getInGame", null);
__decorate([
    (0, common_1.Get)("/:id/win"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getWin", null);
__decorate([
    (0, common_1.Get)("/:id/loose"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getLoose", null);
__decorate([
    (0, common_1.Get)("/:id/rank"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRank", null);
__decorate([
    (0, common_1.Get)("/:id/ratio"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRatio", null);
__decorate([
    (0, common_1.Get)("/:id/avatar"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAvatar", null);
__decorate([
    (0, common_1.Get)("/:id/avatar/path"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAvatarPath", null);
__decorate([
    (0, common_1.Post)("/:id/avatar/upload"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("image", {
        storage: (0, multer_1.diskStorage)({
            destination: "./files",
            filename: file_upload_utils_1.editFileName,
        }),
        fileFilter: file_upload_utils_1.imageFileFilter,
    })),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadedFile", null);
__decorate([
    (0, common_1.Delete)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Delete)("/:id/avatar"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAvatar", null);
__decorate([
    (0, common_1.Patch)("/:id/firstname"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchFirstName", null);
__decorate([
    (0, common_1.Patch)("/:id/lastname"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchLastName", null);
__decorate([
    (0, common_1.Patch)("/:id/username"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchUserName", null);
__decorate([
    (0, common_1.Patch)("/:id/email"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchEmail", null);
__decorate([
    (0, common_1.Patch)("/:id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchStatus", null);
__decorate([
    (0, common_1.Patch)("/:id/gameStatus"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchGameStatus", null);
__decorate([
    (0, common_1.Patch)("/:id/win"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("win")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchWin", null);
__decorate([
    (0, common_1.Patch)("/:id/loose"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("loose")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchLoose", null);
__decorate([
    (0, common_1.Patch)("/:id/rank"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("rank")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchRank", null);
__decorate([
    (0, common_1.Patch)("/:id/addWin"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchAddWin", null);
__decorate([
    (0, common_1.Patch)("/:id/addLoose"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchAddLoose", null);
__decorate([
    (0, common_1.Patch)("/:id/removeWin"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchRemoveWin", null);
__decorate([
    (0, common_1.Patch)("/:id/removeLoose"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchRemoveLoose", null);
__decorate([
    (0, common_1.Patch)("/:id/updateRatio"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchUpdateRatio", null);
__decorate([
    (0, common_1.Patch)("/updateRank"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchUpdateRank", null);
UsersController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map