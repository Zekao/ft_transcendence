import { UserGameStatus, UserStatus } from "../users.enum";
export declare class UsersFiltesDTO {
    firstname?: string;
    lastname?: string;
    display_name?: string;
    username?: string;
    email?: string;
    avatar?: string;
    status?: UserStatus;
    ingame?: UserGameStatus;
    win?: number;
    loose?: number;
    rank?: number;
    ratio?: number;
}
