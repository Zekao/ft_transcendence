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
exports.MatchsService = exports.MatchsRelationPicker = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const matchs_entity_1 = require("./matchs.entity");
const users_service_1 = require("../users/users.service");
const matchs_enum_1 = require("./matchs.enum");
function isMatchs(id) {
    const splited = id.split("-");
    return (id.length === 36 &&
        splited.length === 5 &&
        splited[0].length === 8 &&
        splited[1].length === 4 &&
        splited[2].length === 4 &&
        splited[3].length === 4 &&
        splited[4].length === 12);
}
class MatchsRelationPicker {
}
exports.MatchsRelationPicker = MatchsRelationPicker;
let MatchsService = class MatchsService {
    constructor(MatchsRepository, userService) {
        this.MatchsRepository = MatchsRepository;
        this.userService = userService;
    }
    async getMatchs() {
        const matchs = await this.MatchsRepository.find();
        if (!matchs)
            throw new common_1.NotFoundException(`Matchs not found`);
        return matchs;
    }
    async getMatchsByFilter(filter) {
        const { FirstPlayer, SecondPlayer, scoreFirstPlayer, scoreSecondPlayer, winner, status, } = filter;
        let matchs = await this.getMatchs();
        if (FirstPlayer)
            matchs = matchs.filter((matchs) => matchs.FirstPlayer === FirstPlayer);
        if (SecondPlayer)
            matchs = matchs.filter((matchs) => matchs.SecondPlayer === SecondPlayer);
        if (scoreFirstPlayer)
            matchs = matchs.filter((matchs) => matchs.scoreFirstPlayer === scoreFirstPlayer);
        if (scoreSecondPlayer)
            matchs = matchs.filter((matchs) => matchs.scoreSecondPlayer === scoreSecondPlayer);
        if (status)
            matchs = matchs.filter((channel) => channel.status === status);
        if (winner)
            matchs = matchs.filter((channel) => channel.winner === winner);
        if (!matchs)
            throw new common_1.NotFoundException(`Channel not found`);
        const match = [];
        for (const el of matchs) {
            match.push(await this.getMatchsId(el.id, [{ withUsers: true }]));
        }
        return match;
    }
    async getMatchsId(id, RelationsPicker) {
        const relations = [];
        if (RelationsPicker) {
            for (const relation of RelationsPicker) {
                relation.withUsers &&
                    relations.push("FirstPlayer") &&
                    relations.push("SecondPlayer");
            }
        }
        let found = null;
        if (isMatchs(id))
            found = await this.MatchsRepository.findOne({
                where: { id: id },
                relations,
            });
        if (!found)
            throw new common_1.NotFoundException(`Channel \`${id}' not found`);
        return found;
    }
    async createMatch(id) {
        const user = await this.userService.getUserId(id, [{ withMatchs: true }]);
        const matchPending = user.matchs.find((m) => m.status === matchs_enum_1.MatchStatus.PENDING || m.status === matchs_enum_1.MatchStatus.STARTED);
        if (matchPending)
            throw new common_1.ConflictException(`You already have a match in progress: \`${matchPending.id}\``);
        const match = this.MatchsRepository.create({
            scoreFirstPlayer: 0,
            scoreSecondPlayer: 0,
            status: matchs_enum_1.MatchStatus.PENDING,
            specs: [],
        });
        await this.MatchsRepository.save(match);
        match.FirstPlayer = user;
        await this.MatchsRepository.save(match);
        return match;
    }
    async addPlayerToMatch(player, match) {
        if (!match.SecondPlayer)
            match.SecondPlayer = player;
        else
            throw new common_1.UnauthorizedException("Match is full");
        if (match.FirstPlayer == player)
            throw new common_1.NotFoundException("Cannot join same match");
        this.MatchsRepository.save(match);
        return match;
    }
    async defineMatch(player) {
        let match = null;
        try {
            match = await this.getMatchs();
            if (!match.length)
                return null;
            for (let el of match) {
                el = await this.getMatchsId(el.id, [{ withUsers: true }]);
                if (el.status === matchs_enum_1.MatchStatus.PENDING &&
                    el.FirstPlayer.id != player.id) {
                    await this.addPlayerToMatch(player, el);
                    match.status = matchs_enum_1.MatchStatus.STARTED;
                    await this.MatchsRepository.save(el);
                    return el;
                }
            }
        }
        catch (err) {
            return null;
        }
        return match;
    }
    async saveMatch(match) {
        return await this.MatchsRepository.save(match);
    }
    async addOnePointToPlayer(id, player) {
        if (player == "ONE") {
            id.scoreFirstPlayer += 1;
            await this.MatchsRepository.save(id);
        }
        else if (player == "TWO") {
            id.scoreSecondPlayer += 1;
            await this.MatchsRepository.save(id);
        }
    }
    async deleteMatch(id) {
        const found = await this.getMatchsId(id);
        if (!found)
            throw new common_1.NotFoundException(`Match \`${id}' not found`);
        const target = await this.MatchsRepository.delete(found.id);
        if (target.affected === 0)
            throw new common_1.NotFoundException(`Match \`${id}' not found`);
        return true;
    }
    async editMatch(id, matchDto) {
        const { FirstPlayer, SecondPlayer, scoreFirstPlayer, scoreSecondPlayer, winner, } = matchDto;
        const found = await this.getMatchsId(id);
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
        this.MatchsRepository.save(found);
        return found;
    }
};
MatchsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(matchs_entity_1.Matchs)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], MatchsService);
exports.MatchsService = MatchsService;
//# sourceMappingURL=matchs.service.js.map