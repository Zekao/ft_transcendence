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
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const matches_entity_1 = require("./matches.entity");
function isMatches(id) {
    const splited = id.split("-");
    return (id.length === 36 &&
        splited.length === 5 &&
        splited[0].length === 8 &&
        splited[1].length === 4 &&
        splited[2].length === 4 &&
        splited[3].length === 4 &&
        splited[4].length === 12);
}
let MatchesService = class MatchesService {
    constructor(matchesRepository) {
        this.matchesRepository = matchesRepository;
    }
    async getMatches() {
        const matches = await this.matchesRepository.find();
        if (!matches)
            throw new common_1.NotFoundException(`Matches not found`);
        return matches;
    }
    async getMatchesByFilter(filter) {
        const { name, permissions, status } = filter;
        const matches = await this.getMatches();
        return matches;
    }
};
MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(matches_entity_1.Matches)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MatchesService);
exports.MatchesService = MatchesService;
//# sourceMappingURL=matches.service.js.map