import { UserStatus, UserGameStatus } from "./users.enum";
export declare class User {
    id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    password: string;
    email: string;
    avatar: string;
    status: UserStatus;
    in_game: UserGameStatus;
    win: number;
    loose: number;
    rank: number;
    ratio: number;
    friends: User[];
    blockedUsers: User[];
}
