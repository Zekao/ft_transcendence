"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
const matchs_dto_1 = require("../../matchs/dto/matchs.dto");
class UserDto {
    constructor(user) {
        if (user) {
            this.id = user.id;
            this.first_name = user.first_name;
            this.last_name = user.last_name;
            this.user_name = user.user_name;
            this.email = user.email;
            this.avatar = user.avatar;
            this.status = user.status;
            this.in_game = user.in_game;
            this.win = user.win;
            this.loose = user.loose;
            this.rank = user.rank;
            this.ratio = user.ratio;
            if (user.friends)
                this.friends = user.friends.map((friend) => {
                    return new UserDto(friend);
                });
            if (user.blockedUsers)
                this.blockedUsers = user.blockedUsers.map((user) => {
                    return new UserDto(user);
                });
            if (user.matches)
                this.matches = user.matches.map((match) => {
                    return new matchs_dto_1.MatchDto(match);
                });
        }
    }
}
exports.UserDto = UserDto;
//# sourceMappingURL=user.dto.js.map