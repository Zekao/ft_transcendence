import { UserGameStatus, UserStatus } from "../users.enum";
import { User } from "../users.entity";
import { MatchDto } from "../../matchs/dto/matchs.dto";
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
}
