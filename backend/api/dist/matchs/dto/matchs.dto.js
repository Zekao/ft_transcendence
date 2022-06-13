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
            this.status = match.status;
            if (match.specs)
                this.specs = match.specs.map((play) => {
                    return new user_dto_1.UserDto(play);
                });
        }
    }
}
exports.MatchDto = MatchDto;
//# sourceMappingURL=matchs.dto.js.map