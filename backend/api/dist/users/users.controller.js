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
const swagger_1 = require("@nestjs/swagger");
const file_upload_dto_1 = require("./dto/file-upload.dto");
const platform_express_1 = require("@nestjs/platform-express");
const user_filter_dto_1 = require("./dto/user-filter.dto");
const jwt_auth_guard_1 = require("../auth/guard/jwt.auth.guard");
const users_entity_1 = require("./users.entity");
const users_service_1 = require("./users.service");
const multer_1 = require("multer");
const file_upload_utils_1 = require("./file-upload.utils");
const nestjs_swagger_api_exception_decorator_1 = require("@nanogiants/nestjs-swagger-api-exception-decorator");
const templated_api_exception_1 = require("./template/templated-api-exception");
const yargs_1 = require("yargs");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getUsers(filters) {
        if (Object.keys(filters).length)
            return this.usersService.getUserByFilter(filters);
        return this.usersService.getUsers();
    }
    getRankedUsers() {
        return this.usersService.getRankedUsers();
    }
    getUserId(req, id) {
        return this.usersService.getUserId(id === "me" ? req.user.id : id);
    }
    getAvatar(req, id, res) {
        return this.usersService.getAvatar(id === "me" ? req.user.id : id, res);
    }
    getFriends(req) {
        const user = req.user;
        return this.usersService.getFriends(user.id);
    }
    getMatch(req, id) {
        return this.usersService.getMatchs(id === "me" ? req.user.id : id);
    }
    getBlocked(req) {
        const user = req.user;
        return this.usersService.getBlocked(user.id);
    }
    getWhoFollowMe(req) {
        return this.usersService.getWhoFollowMe(req.user.id);
    }
    addFriend(req, query) {
        const user = req.user;
        return this.usersService.addFriend(user.id, query.friend);
    }
    addBlocked(req, query) {
        const user = req.user;
        return this.usersService.addBlocked(user.id, query.blocked);
    }
    async uploadedFile(req, file) {
        const user = req.user;
        return this.usersService.uploadFile(user, file);
    }
    deleteUser(req, id) {
        return this.usersService.deleteUser(id === "me" ? req.user.id : id);
    }
    deleteAvatar(req, id) {
        return this.usersService.deleteAvatar(id === "me" ? req.user.id : id);
    }
    removeFriend(req, query) {
        const user = req.user;
        return this.usersService.removeFriend(user.id, query.friend);
    }
    removeBlocked(req, id, query) {
        const user = req.user;
        return this.usersService.removeBlocked(user.id, query.blocked);
    }
    patchUser(req, id, body) {
        return this.usersService.patchUser(id === "me" ? req.user.id : id, body);
    }
    patchUpdateRank() {
        return this.usersService.patchUpdateRank();
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Return list of all existing users" }),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
        type: users_entity_1.User,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_filter_dto_1.UsersFiltesDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)("/ranklist"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Return all user in ranked order" }),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
        type: [users_entity_1.User],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRankedUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Return profile of user associated with :id",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
        type: [users_entity_1.User],
    }),
    (0, nestjs_swagger_api_exception_decorator_1.ApiException)(() => common_1.UnauthorizedException, { description: "Unauthorized" }),
    (0, swagger_1.ApiOperation)({ summary: "Return specifc user profile" }),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
        type: [users_entity_1.User],
    }),
    (0, nestjs_swagger_api_exception_decorator_1.ApiException)(() => common_1.UnauthorizedException, { description: "Unauthorized" }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserId", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/:id/avatar"),
    (0, swagger_1.ApiOperation)({
        summary: "Return the avatar of a specified user profile",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
    }),
    (0, templated_api_exception_1.UserApiException)(() => common_1.NotFoundException),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAvatar", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/me/friends"),
    (0, swagger_1.ApiOperation)({
        summary: "Return the list of friends w/crediential",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
    }),
    (0, templated_api_exception_1.UserApiException)(() => common_1.NotFoundException),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFriends", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/:id/matchs"),
    (0, swagger_1.ApiOperation)({
        summary: "Return the list of matchs of a specified user profile",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
    }),
    (0, templated_api_exception_1.UserApiException)(() => common_1.NotFoundException),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMatch", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/me/blocked"),
    (0, swagger_1.ApiOperation)({
        summary: "Return the list of blocked users w/credential",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
    }),
    (0, templated_api_exception_1.UserApiException)(() => common_1.NotFoundException),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getBlocked", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/me/whofollowme"),
    (0, swagger_1.ApiOperation)({
        summary: "Return all users that are in your friends list w/credential",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
    }),
    (0, templated_api_exception_1.UserApiException)(() => common_1.NotFoundException),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getWhoFollowMe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("/me/friends"),
    (0, swagger_1.ApiOperation)({
        summary: "Add a friend w/crediential",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addFriend", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("/me/blocked"),
    (0, swagger_1.ApiOperation)({
        summary: "Add a blocked user w/credential",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addBlocked", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("/me/upload"),
    (0, swagger_1.ApiOperation)({
        summary: "Upload avatar for the specified user profile",
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("image", {
        storage: (0, multer_1.diskStorage)({
            destination: "./image",
            filename: file_upload_utils_1.editFileName,
        }),
        fileFilter: file_upload_utils_1.imageFileFilter,
    })),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
        type: file_upload_dto_1.FileUploadDto,
    }),
    (0, templated_api_exception_1.UserApiException)(() => common_1.NotFoundException),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadedFile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)("/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Delete the specified user profile",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
        type: yargs_1.boolean,
    }),
    (0, templated_api_exception_1.UserApiException)(() => common_1.NotFoundException),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)("/:id/avatar"),
    (0, swagger_1.ApiOperation)({
        summary: "Delete the specified avatar for the specified user profile",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
        type: yargs_1.boolean,
    }),
    (0, templated_api_exception_1.UserApiException)(() => common_1.NotFoundException),
    (0, templated_api_exception_1.AvatarApiException)(() => common_1.UnauthorizedException),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAvatar", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)("/me/friends"),
    (0, swagger_1.ApiOperation)({
        summary: "delete a friend w/crediential",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeFriend", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)("/me/blocked"),
    (0, swagger_1.ApiOperation)({
        summary: "delete a friend w/credential",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeBlocked", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)("/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Update the specified user profile",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
        type: yargs_1.boolean,
    }),
    (0, templated_api_exception_1.UserApiException)(() => common_1.NotFoundException),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchUser", null);
__decorate([
    (0, common_1.Patch)("/updateRank"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: "Update the rank for the specified user profile",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Ok.",
        type: yargs_1.boolean,
    }),
    (0, templated_api_exception_1.UserApiException)(() => common_1.NotFoundException),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchUpdateRank", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)("users"),
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map