import { Matchs } from "../matchs/matchs.entity";
import { UserStatus, UserGameStatus } from "./users.enum";
export declare class User {
    id: string;
    FortyTwoID: number;
    first_name: string;
    last_name: string;
    user_name: string;
    display_name: string;
    email: string;
    avatar: string;
    TwoFA: boolean;
    First_time: boolean;
    TwoFAVerify: string;
    status: UserStatus;
    in_game: UserGameStatus;
    win: number;
    loose: number;
    rank: number;
    ratio: number;
    color: number;
    backgroundColor: number;
    matchs: Matchs[];
    friends: User[];
    blockedUsers: User[];
}
