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
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    logfortytwo(req) { }
    callbackfortytwo(req) {
        return this.authService.GenerateJwtToken(req.user._json.id);
    }
    test(req) {
        console.log(req.user);
        this.authService.GenerateJwtToken(req.user);
    }
    async qrcode() {
        const Test = await this.authService.generateQR();
        console.log(Test);
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
    (0, common_1.Post)("/test"),
    (0, swagger_1.ApiOperation)({
        summary: "Debugging purpose / Check if the token work",
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "test", null);
__decorate([
    (0, common_1.Get)("/qrcode"),
    (0, swagger_1.ApiOperation)({
        summary: "Get image of qrcode",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "qrcode", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_services_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map