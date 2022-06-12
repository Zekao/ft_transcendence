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
let MatchesController = class MatchesController {
    constructor(matchService) {
        this.matchService = matchService;
    }
    getMatches(filters) {
        return;
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
MatchesController = __decorate([
    (0, swagger_1.ApiTags)("matches"),
    (0, common_1.Controller)("matches"),
    __metadata("design:paramtypes", [matches_service_1.MatchesService])
], MatchesController);
exports.MatchesController = MatchesController;
//# sourceMappingURL=matches.controller.js.map