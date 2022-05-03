export interface User {
    id : string;
    first_name : string;
    last_name : string;
    nick_name:  string;
    status : UserStatus;
};

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}