"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchDto = void 0;
const user_dto_1 = require("../../users/dto/user.dto");
class MatchDto {
    constructor(match) {
        if (match) {
            this.id = match.id;
            this.FirstPlayer = match.FirstPlayer;
            this.SecondPlayer = match.SecondPlayer;
            this.scoreFirstPlayer = match.scoreFirstPlayer;
            this.scoreSecondPlayer = match.scoreSecondPlayer;
            this.winner = match.winner;
            if (match.player)
                this.player = match.player.map((play) => {
                    return new user_dto_1.UserDto(play);
                });
        }
    }
}
exports.MatchDto = MatchDto;
//# sourceMappingURL=matches.dto.js.map