import { UserGameStatus, UserStatus } from "../users.enum";
import { User } from "../users.entity";
import { MatchDto } from "../../matchs/dto/matchs.dto";
import { Channel } from "src/channels/channels.entity";
export declare class UserDto {
    constructor(user?: User);
    id: string;
    FortyTwoID: number;
    first_name: string;
    last_name: string;
    user_name: string;
    display_name: string;
    email: string;
    avatar: string;
    status: UserStatus;
    in_game: UserGameStatus;
    win: number;
    loose: number;
    rank: number;
    ratio: number;
    TwoFA: boolean;
    matchs: MatchDto[];
    friends: UserDto[];
    blockedUsers: UserDto[];
    joined_channels: Channel[];
    ownered_channels: Channel[];
    admined_channels: Channel[];
}
