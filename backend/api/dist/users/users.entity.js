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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const swagger_1 = require("@nestjs/swagger");
const channels_entity_1 = require("../channels/channels.entity");
const typeorm_1 = require("typeorm");
const matchs_entity_1 = require("../matchs/matchs.entity");
const users_enum_1 = require("./users.enum");
let User = User_1 = class User {
};
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "FortyTwoID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "user_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "display_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], User.prototype, "TwoFA", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], User.prototype, "First_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "TwoFAVerify", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "in_game", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "win", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "loose", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "rank", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: "real" }),
    __metadata("design:type", Number)
], User.prototype, "ratio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => matchs_entity_1.Matchs }),
    (0, typeorm_1.OneToMany)(() => matchs_entity_1.Matchs, (matchs) => matchs.FirstPlayer || matchs.SecondPlayer),
    (0, typeorm_1.JoinTable)({ name: "MatchHistory" }),
    __metadata("design:type", Array)
], User.prototype, "matchs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.ManyToMany)(() => User_1, (user) => user.friends),
    (0, typeorm_1.JoinTable)({ name: "friends" }),
    __metadata("design:type", Array)
], User.prototype, "friends", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.ManyToMany)(() => User_1, (user) => user.blockedUsers),
    (0, typeorm_1.JoinTable)({ name: "blockedUsers" }),
    __metadata("design:type", Array)
], User.prototype, "blockedUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.ManyToMany)(() => channels_entity_1.Channel, (channel) => channel.members, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: "joinedChannels" }),
    __metadata("design:type", Array)
], User.prototype, "joinedChannels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.ManyToMany)(() => channels_entity_1.Channel, (channel) => channel.admins, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: "adminedChannels" }),
    __metadata("design:type", Array)
], User.prototype, "adminedChannels", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => channels_entity_1.Channel, (channel) => channel.owner, { nullable: true }),
    (0, swagger_1.ApiProperty)({ type: () => channels_entity_1.Channel }),
    (0, typeorm_1.JoinTable)({ name: "ownedChannels" }),
    __metadata("design:type", Array)
], User.prototype, "ownedChannels", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => channels_entity_1.Channel, (channel) => channel.mutedUsers, {
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({ type: () => channels_entity_1.Channel }),
    (0, typeorm_1.JoinTable)({ name: "mutedChannels" }),
    __metadata("design:type", Array)
], User.prototype, "mutedChannels", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => channels_entity_1.Channel, (channel) => channel.bannedUsers, {
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({ type: () => channels_entity_1.Channel }),
    (0, typeorm_1.JoinTable)({ name: "bannedChannels" }),
    __metadata("design:type", Array)
], User.prototype, "bannedChannels", void 0);
User = User_1 = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=users.entity.js.map