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
exports.ChannelPasswordDto = exports.ChannelsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_dto_1 = require("../../users/dto/user.dto");
const channels_enum_1 = require("../channels.enum");
class ChannelsDto {
    constructor(channel) {
        if (channel) {
            this.id = channel.id;
            this.name = channel.name;
            this.status = channel.status;
            this.permissions = channel.permissions;
            this.password = channel.password;
            this.members = channel.members;
            this.admins = channel.admins;
            this.owner = channel.owner;
            if (channel.mutedUsers)
                this.mutedUsers = channel.mutedUsers.map((user) => { return new user_dto_1.UserDto(); });
            if (channel.bannedUsers)
                this.bannedUsers = channel.bannedUsers.map((user) => { return new user_dto_1.UserDto(); });
            if (channel.members)
                this.members = channel.members.map((user) => { return new user_dto_1.UserDto(); });
            if (channel.admins)
                this.admins = channel.admins.map((user) => { return new user_dto_1.UserDto(); });
            if (channel.owner)
                this.owner = new user_dto_1.UserDto(channel.owner);
        }
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChannelsDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(channels_enum_1.ChannelPermissions, {
        message: "permissions must be: ON_INVITE, OPEN",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChannelsDto.prototype, "permissions", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(channels_enum_1.ChannelStatus, {
        message: "status must be: PRIVATE, PUBLIC",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChannelsDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(8),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChannelsDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChannelsDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ChannelsDto.prototype, "members", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ChannelsDto.prototype, "admins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => user_dto_1.UserDto }),
    __metadata("design:type", user_dto_1.UserDto)
], ChannelsDto.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ChannelsDto.prototype, "mutedUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ChannelsDto.prototype, "bannedUsers", void 0);
exports.ChannelsDto = ChannelsDto;
class ChannelPasswordDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(12),
    (0, class_validator_1.MaxLength)(32),
    (0, class_validator_1.Matches)(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "password is too weak",
    }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChannelPasswordDto.prototype, "password", void 0);
exports.ChannelPasswordDto = ChannelPasswordDto;
//# sourceMappingURL=channels.dto.js.map