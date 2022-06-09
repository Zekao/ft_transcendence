export interface User {
    id: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    email: string;
    password: string;
    friends: User[];
    status: UserStatus;
}
export declare enum UserStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE"
}
