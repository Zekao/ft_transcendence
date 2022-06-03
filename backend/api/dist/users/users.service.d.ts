import { UserStatus } from './users-status.enum';
import { createUserDTO } from './dto/create-user.dto';
import { UsersFiltesDTO } from './dto/user-filter.dto';
import { User } from './users.entity';
import { Repository } from 'typeorm';
export declare class UsersService {
    private UserRepository;
    constructor(UserRepository: Repository<User>);
    getUsers(): Promise<User[]>;
    getUserByFilter(filter: UsersFiltesDTO): Promise<User[]>;
    getUserId(id: string): Promise<User>;
    getFirstName(id: string): Promise<string>;
    getLastName(id: string): Promise<string>;
    getUserName(id: string): Promise<string>;
    getEmail(id: string): Promise<string>;
    getStatus(id: string): Promise<UserStatus>;
    createUser(createUser: createUserDTO): Promise<User>;
    deleteUser(id: string): Promise<void>;
    patchFirstName(id: string, first_name: string): Promise<string>;
    patchLastName(id: string, last_name: string): Promise<string>;
    patchUserName(id: string, user_name: string): Promise<string>;
    patchEmail(id: string, email: string): Promise<string>;
    patchStatus(id: string, status: UserStatus): Promise<UserStatus>;
}
