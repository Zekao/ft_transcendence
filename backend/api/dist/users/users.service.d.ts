import { UserStatus } from "./users-status.enum";
import { createUserDTO } from "./dto/create-user.dto";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { User } from "./users.entity";
import { Repository } from "typeorm";
export declare class UsersService {
    private UserRepository;
    constructor(UserRepository: Repository<User>);
    getUsers(): Promise<User[]>;
    getUserByFilter(filter: UsersFiltesDTO): Promise<User[]>;
    getUserId(id_params: string): Promise<User>;
    getFirstName(id_params: string): Promise<string>;
    getLastName(id_params: string): Promise<string>;
    getUserName(id_params: string): Promise<string>;
    getEmail(id_params: string): Promise<string>;
    getStatus(id_params: string): Promise<UserStatus>;
    createUser(createUser: createUserDTO): Promise<User>;
    deleteUser(id: string): Promise<void>;
    patchFirstName(id_params: string, first_name: string): Promise<string>;
    patchLastName(id_params: string, last_name: string): Promise<string>;
    patchUserName(id_params: string, user_name: string): Promise<string>;
    patchEmail(id_params: string, email: string): Promise<string>;
    patchStatus(id_params: string, status: UserStatus): Promise<UserStatus>;
}
