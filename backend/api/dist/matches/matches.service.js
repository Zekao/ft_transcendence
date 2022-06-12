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
const users_service_1 = require("../users/users.service");
const matches_enum_1 = require("./matches.enum");
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
    constructor(matchesRepository, userService) {
        this.matchesRepository = matchesRepository;
        this.userService = userService;
    }
    async getMatches() {
        const matches = await this.matchesRepository.find();
        if (!matches)
            throw new common_1.NotFoundException(`Matches not found`);
        return matches;
    }
    async getMatchesByFilter(filter) {
        const { FirstPlayer, SecondPlayer, scoreFirstPlayer, scoreSecondPlayer, winner, } = filter;
        let matches = await this.getMatches();
        if (FirstPlayer)
            matches = matches.filter((channel) => channel.FirstPlayer === FirstPlayer);
        if (SecondPlayer)
            matches = matches.filter((channel) => channel.SecondPlayer === SecondPlayer);
        if (scoreFirstPlayer)
            matches = matches.filter((channel) => channel.scoreFirstPlayer === scoreFirstPlayer);
        if (scoreSecondPlayer)
            matches = matches.filter((channel) => channel.scoreSecondPlayer === scoreSecondPlayer);
        if (winner)
            matches = matches.filter((channel) => channel.winner === winner);
        if (!matches)
            throw new common_1.NotFoundException(`Channel not found`);
        return matches;
    }
    async getMatchesId(id) {
        let found = null;
        if (isMatches(id))
            found = await this.matchesRepository.findOne({ where: { id: id } });
        if (!found)
            throw new common_1.NotFoundException(`Channel \`${id}' not found`);
        return found;
    }
    async createMatch(user) {
        const match = this.matchesRepository.create({
            FirstPlayer: user.id,
        });
        try {
            match.player = [];
            match.player.push(user);
            match.MatchStatus = matches_enum_1.MatchStatus.PENDING;
            await this.matchesRepository.save(match);
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException();
        }
        return match;
    }
    async addMatchToPlayer(player, match) {
        player.matches.push(match);
        await this.userService.saveUser(player);
        return match;
    }
    async addPlayerToMatch(player, match) {
        if (!match.SecondPlayer)
            match.SecondPlayer = player.id;
        else
            throw new common_1.UnauthorizedException("Match is full");
        match.player.push(player);
        this.matchesRepository.save(match);
        return match;
    }
    async defineMatch(id, match_id) {
        const player = await this.userService.getUserId(id);
        const match = await this.getMatchesId(match_id);
        try {
            await this.addPlayerToMatch(player, match);
        }
        catch (err) {
            console.log(err);
        }
        await this.addMatchToPlayer(player, match);
        return match;
    }
    async deleteMatch(id) {
        const found = await this.getMatchesId(id);
        if (!found)
            throw new common_1.NotFoundException(`Match \`${id}' not found`);
        const target = await this.matchesRepository.delete(found);
        if (target.affected === 0)
            throw new common_1.NotFoundException(`Match \`${id}' not found`);
        return true;
    }
    async editMatch(id, matchDto) {
        const { FirstPlayer, SecondPlayer, scoreFirstPlayer, scoreSecondPlayer, winner, } = matchDto;
        const found = await this.getMatchesId(id);
        if (FirstPlayer)
            found.FirstPlayer = FirstPlayer;
        if (SecondPlayer)
            found.SecondPlayer = SecondPlayer;
        if (scoreFirstPlayer)
            found.scoreFirstPlayer = scoreFirstPlayer;
        if (scoreSecondPlayer)
            found.scoreSecondPlayer = scoreSecondPlayer;
        if (winner)
            found.winner = winner;
        this.matchesRepository.save(found);
        return found;
    }
};
MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(matches_entity_1.Matches)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], MatchesService);
exports.MatchesService = MatchesService;
//# sourceMappingURL=matches.service.js.map