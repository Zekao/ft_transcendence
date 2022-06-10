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
exports.AuthCodeDto = exports.LoginFortyTwoDto = exports.AuthCredentialsFortyTwoDto = exports.AuthCredentialsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class AuthCredentialsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AuthCredentialsDto.prototype, "FortyTwoID", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(8),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthCredentialsDto.prototype, "user_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthCredentialsDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthCredentialsDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthCredentialsDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthCredentialsDto.prototype, "avatar", void 0);
exports.AuthCredentialsDto = AuthCredentialsDto;
class AuthCredentialsFortyTwoDto {
}
exports.AuthCredentialsFortyTwoDto = AuthCredentialsFortyTwoDto;
class LoginFortyTwoDto {
}
exports.LoginFortyTwoDto = LoginFortyTwoDto;
class AuthCodeDto {
}
exports.AuthCodeDto = AuthCodeDto;
//# sourceMappingURL=auth-credentials.dto.js.map