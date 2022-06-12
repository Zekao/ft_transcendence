import { UserGameStatus, UserStatus } from "../users.enum";
import { User } from "../users.entity";
import { MatchDto } from "../../matches/dto/matches.dto";
export declare class UserDto {
    constructor(user?: User);
    id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    avatar: string;
    status: UserStatus;
    in_game: UserGameStatus;
    win: number;
    loose: number;
    rank: number;
    ratio: number;
    matches: MatchDto[];
    friends: UserDto[];
    blockedUsers: UserDto[];
}
