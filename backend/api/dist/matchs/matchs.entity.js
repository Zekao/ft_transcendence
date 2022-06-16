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
exports.Matchs = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../users/users.entity");
const matchs_enum_1 = require("./matchs.enum");
let Matchs = class Matchs {
};
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Matchs.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => users_entity_1.User }),
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.matchs),
    (0, typeorm_1.JoinTable)({ name: "firstPlayer" }),
    __metadata("design:type", users_entity_1.User)
], Matchs.prototype, "FirstPlayer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => users_entity_1.User }),
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.matchs, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: "secondPlayer" }),
    __metadata("design:type", users_entity_1.User)
], Matchs.prototype, "SecondPlayer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Matchs.prototype, "scoreFirstPlayer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Matchs.prototype, "scoreSecondPlayer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Matchs.prototype, "posFirstPlayer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Matchs.prototype, "posSecondPlayer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Matchs.prototype, "posBallx", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Matchs.prototype, "posBally", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "real" }),
    __metadata("design:type", Number)
], Matchs.prototype, "direction", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => users_entity_1.User, (user) => user.matchs, { nullable: true }),
    __metadata("design:type", users_entity_1.User)
], Matchs.prototype, "winner", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Matchs.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => users_entity_1.User }),
    (0, typeorm_1.ManyToMany)(() => users_entity_1.User, (user) => user.matchs),
    (0, typeorm_1.JoinTable)({ name: "Spectators" }),
    __metadata("design:type", Array)
], Matchs.prototype, "specs", void 0);
Matchs = __decorate([
    (0, typeorm_1.Entity)()
], Matchs);
exports.Matchs = Matchs;
//# sourceMappingURL=matchs.entity.js.map