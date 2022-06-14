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
exports.Channel = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_dto_1 = require("../users/dto/user.dto");
const users_entity_1 = require("../users/users.entity");
const typeorm_1 = require("typeorm");
const channels_enum_1 = require("./channels.enum");
let Channel = class Channel {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Channel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Channel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Channel.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Channel.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Channel.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true, nullable: true }),
    __metadata("design:type", Array)
], Channel.prototype, "history", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => users_entity_1.User, (user) => user.joined_channels, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: "members" }),
    __metadata("design:type", Array)
], Channel.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => users_entity_1.User, (user) => user.admined_channels, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: "admins" }),
    __metadata("design:type", Array)
], Channel.prototype, "admins", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => users_entity_1.User, (user) => user.ownered_channels),
    (0, swagger_1.ApiProperty)({ type: () => users_entity_1.User }),
    (0, typeorm_1.JoinTable)({ name: "owner" }),
    __metadata("design:type", user_dto_1.UserDto)
], Channel.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => users_entity_1.User, (user) => user.mutedChannels, { nullable: true }),
    (0, swagger_1.ApiProperty)({ type: () => users_entity_1.User }),
    (0, typeorm_1.JoinTable)({ name: "muted" }),
    __metadata("design:type", Array)
], Channel.prototype, "mutedUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => users_entity_1.User, (user) => user.bannedChannels, { nullable: true }),
    (0, swagger_1.ApiProperty)({ type: () => users_entity_1.User }),
    (0, typeorm_1.JoinTable)({ name: "banned" }),
    __metadata("design:type", Array)
], Channel.prototype, "bannedUsers", void 0);
Channel = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.TableInheritance)({ column: { type: "varchar", name: "type" } })
], Channel);
exports.Channel = Channel;
//# sourceMappingURL=channels.entity.js.map