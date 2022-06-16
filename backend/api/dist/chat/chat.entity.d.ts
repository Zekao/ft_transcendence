import { User } from "../users/users.entity";
export declare class Chat {
    id: string;
    participants: User[];
    history: {
        login: string;
        message: string;
    }[];
}
