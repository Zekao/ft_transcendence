import { UserStatus, UserGameStatus } from "./../users/users-status.enum";
export declare class User {
    id: string;
    user_name: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
    status: UserStatus;
    in_game: UserGameStatus;
    win: number;
    loose: number;
    rank: number;
}
