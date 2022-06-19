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
exports.MatchsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const matchs_filter_dto_1 = require("./dto/matchs-filter.dto");
const matchs_service_1 = require("./matchs.service");
const matchs_dto_1 = require("./dto/matchs.dto");
let MatchsController = class MatchsController {
    constructor(matchService) {
        this.matchService = matchService;
    }
    getMatchs(filters) {
        if (Object.keys(filters).length)
            return this.matchService.getMatchsByFilter(filters);
        return this.matchService.getMatchs();
    }
    getMatchsId(id, req) {
        return this.matchService.getMatchsId(id, [{ withUsers: true }]);
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
    (0, swagger_1.ApiOperation)({ summary: "Return list of all existing matchs" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [matchs_filter_dto_1.MatchsFilteDto]),
    __metadata("design:returntype", Promise)
], MatchsController.prototype, "getMatchs", null);
__decorate([
    (0, common_1.Get)("/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Return a match by id" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MatchsController.prototype, "getMatchsId", null);
__decorate([
    (0, common_1.Delete)("/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Delete the specified matchs",
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchsController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Patch)("/:id/edit"),
    (0, swagger_1.ApiOperation)({
        summary: "Modify attribute of a specified matchs",
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, matchs_dto_1.MatchDto]),
    __metadata("design:returntype", Promise)
], MatchsController.prototype, "editChannel", null);
MatchsController = __decorate([
    (0, swagger_1.ApiTags)("matchs"),
    (0, common_1.Controller)("matchs"),
    __metadata("design:paramtypes", [matchs_service_1.MatchsService])
], MatchsController);
exports.MatchsController = MatchsController;
//# sourceMappingURL=matchs.controller.js.map