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
exports.ChannelsDto = void 0;
const class_validator_1 = require("class-validator");
const channels_enum_1 = require("../channels.enum");
class ChannelsDto {
}
__decorate([
    (0, class_validator_1.IsEnum)(channels_enum_1.ChannelPermissions, {
        message: "permissions must be: ON_INVITE, OPEN",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChannelsDto.prototype, "permissions", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(channels_enum_1.ChannelStatus, {
        message: "status must be: PRIVATE, PUBLIC",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChannelsDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(8),
    __metadata("design:type", String)
], ChannelsDto.prototype, "name", void 0);
exports.ChannelsDto = ChannelsDto;
//# sourceMappingURL=channels.dto.js.map