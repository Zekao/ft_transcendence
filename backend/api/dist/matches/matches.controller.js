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
exports.MatchesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const matches_filter_dto_1 = require("./dto/matches-filter.dto");
const matches_service_1 = require("./matches.service");
const matches_dto_1 = require("./dto/matches.dto");
const jwt_auth_guard_1 = require("../auth/guard/jwt.auth.guard");
let MatchesController = class MatchesController {
    constructor(matchService) {
        this.matchService = matchService;
    }
    getMatches(filters) {
        if (Object.keys(filters).length)
            return this.matchService.getMatchesByFilter(filters);
        return this.matchService.getMatches();
    }
    createMatch(req) {
        const user = req.user;
        return this.matchService.createMatch(user);
    }
    addUserToMatchMatch(req) {
        const user = req.user;
        return this.matchService.defineMatch(user);
    }
    deleteUser(id) {
        return this.matchService.deleteMatch(id);
    }
    editChannel(id, edit) {
        return this.matchService.editMatch(id, edit);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Return list of all existing matches" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [matches_filter_dto_1.MatchesFilteDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getMatches", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("/create"),
    (0, swagger_1.ApiOperation)({
        summary: "Create a new match",
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "createMatch", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("/join"),
    (0, swagger_1.ApiOperation)({
        summary: "Join a match",
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "addUserToMatchMatch", null);
__decorate([
    (0, common_1.Delete)("/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Delete the specified matches",
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Patch)("/:id/edit"),
    (0, swagger_1.ApiOperation)({
        summary: "Modify attribute of a specified matches",
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, matches_dto_1.MatchDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "editChannel", null);
MatchesController = __decorate([
    (0, swagger_1.ApiTags)("matches"),
    (0, common_1.Controller)("api/matches"),
    __metadata("design:paramtypes", [matches_service_1.MatchesService])
], MatchesController);
exports.MatchesController = MatchesController;
//# sourceMappingURL=matches.controller.js.map