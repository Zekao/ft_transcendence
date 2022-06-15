"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
const matchs_dto_1 = require("../../matchs/dto/matchs.dto");
const channels_dto_1 = require("../../channels/dto/channels.dto");
const channels_entity_1 = require("../../channels/channels.entity");
class UserDto {
    constructor(user) {
        if (user) {
            this.id = user.id;
            this.FortyTwoID = user.FortyTwoID;
            this.first_name = user.first_name;
            this.last_name = user.last_name;
            this.user_name = user.user_name;
            this.display_name = user.display_name;
            this.email = user.email;
            this.avatar = user.avatar;
            this.status = user.status;
            this.in_game = user.in_game;
            this.win = user.win;
            this.loose = user.loose;
            this.rank = user.rank;
            this.ratio = user.ratio;
            this.TwoFA = user.TwoFA;
            if (user.friends)
                this.friends = user.friends.map((friend) => {
                    return new UserDto(friend);
                });
            if (user.blockedUsers)
                this.blockedUsers = user.blockedUsers.map((user) => {
                    return new UserDto(user);
                });
            if (user.matchs)
                this.matchs = user.matchs.map((match) => {
                    return new matchs_dto_1.MatchDto(match);
                });
            if (user.joined_channels)
                this.joined_channels = user.joined_channels.map((channel) => {
                    return new channels_entity_1.Channel();
                });
            if (user.ownered_channels)
                this.ownered_channels = user.ownered_channels.map((channel) => {
                    return new channels_entity_1.Channel();
                });
            if (user.admined_channels)
                this.admined_channels = user.admined_channels.map((channel) => {
                    return new channels_dto_1.ChannelsDto();
                });
            if (user.bannedChannels)
                this.bannedChannels = user.bannedChannels.map((channel) => {
                    return new channels_dto_1.ChannelsDto();
                });
            if (user.mutedChannels)
                this.mutedChannels = user.mutedChannels.map((channel) => {
                    return new channels_dto_1.ChannelsDto();
                });
        }
    }
}
exports.UserDto = UserDto;
//# sourceMappingURL=user.dto.js.map