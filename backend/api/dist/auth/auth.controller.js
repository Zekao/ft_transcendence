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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_services_1 = require("./auth.services");
const _42_auth_guard_1 = require("./guard/42.auth.guard");
const jwt_auth_guard_1 = require("./guard/jwt.auth.guard");
const swagger_1 = require("@nestjs/swagger");
const fs = require("fs");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    logfortytwo(req) { }
    callbackfortytwo(req) {
        return this.authService.GenerateJwtToken(req.user._json.id, req.user.First_time);
    }
    async verifyGToken(body) {
        try {
            if (this.authService.verifyJwtToken(body.gtoken))
                return true;
        }
        catch (err) { }
        throw new common_1.UnauthorizedException("Acces token provided is not allowed");
    }
    async verifyQrCode(req, query) {
        try {
            if ((await this.authService.verifyQR(query.gcode, req.user)) == true)
                return this.authService.GenerateGToken(query.gcode);
        }
        catch (err) { }
        throw new common_1.UnauthorizedException("GToken provided is incorrect");
    }
    async qrcode(req) {
        const user = req.user.user_name;
        const Test = await this.authService.generateQR(req.user);
        const file = fs;
        file.writeFile("image/google/" + user + ".png", Test.qrcode.substring(22), { encoding: "base64" }, function (err) {
            if (err) {
                console.log(err);
                return false;
            }
            else {
                console.log("The file was saved!");
                return true;
            }
        });
        return true;
    }
};
__decorate([
    (0, common_1.Get)("/login"),
    (0, swagger_1.ApiOperation)({
        summary: "Log into intra 42",
    }),
    (0, common_1.UseGuards)(_42_auth_guard_1.FortyTwoAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logfortytwo", null);
__decorate([
    (0, common_1.Get)("/callback"),
    (0, swagger_1.ApiOperation)({
        summary: "Create or login with user 42",
    }),
    (0, common_1.UseGuards)(_42_auth_guard_1.FortyTwoAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "callbackfortytwo", null);
__decorate([
    (0, common_1.Post)("/qrcode/verify"),
    (0, swagger_1.ApiOperation)({
        summary: "Verify if code is valid",
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyGToken", null);
__decorate([
    (0, common_1.Post)("/qrcode"),
    (0, swagger_1.ApiOperation)({
        summary: "Verify if code is valid",
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyQrCode", null);
__decorate([
    (0, common_1.Get)("/qrcode"),
    (0, swagger_1.ApiOperation)({
        summary: "Get image of qrcode",
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "qrcode", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_services_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map