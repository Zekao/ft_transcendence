import { createUserDTO } from "./dto/create-user.dto";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { UserStatus } from "./users-status.enum";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
export declare class UsersController {
    private UsersService;
    constructor(UsersService: UsersService);
    getUsers(filters: UsersFiltesDTO): Promise<User[]>;
    getUserId(id: string): Promise<User>;
    getFirstName(id: string): Promise<string>;
    getLastName(id: string): Promise<string>;
    getUserName(id: string): Promise<string>;
    getEmail(id: string): Promise<string>;
    getStatus(id: string): Promise<UserStatus>;
    createUser(createUser: createUserDTO): Promise<User>;
    deleteUser(id: string): Promise<void>;
    patchFirstName(id: string, query: any): Promise<string>;
    patchLastName(id: string, query: any): Promise<string>;
    patchUserName(id: string, query: any): Promise<string>;
    patchEmail(id: string, query: any): Promise<string>;
    patchStatus(id: string, query: any): Promise<UserStatus>;
}
