import { UserStatus, UserGameStatus } from "./users-status.enum";
export declare class User {
    id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    password: string;
    email: string;
    status: UserStatus;
    in_game: UserGameStatus;
    win: number;
    loose: number;
    rank: number;
    ratio: number;
}
