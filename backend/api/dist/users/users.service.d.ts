import { UserStatus } from './users-status.enum';
import { createUserDTO } from './dto/create-user.dto';
import { UsersFiltesDTO } from './dto/user-filter.dto';
import { User } from './users.entity';
import { Repository } from 'typeorm';
export declare class UsersService {
    private UserRepository;
    constructor(UserRepository: Repository<User>);
    getUser(): Promise<User[]>;
    getUsers(): Promise<User[]>;
    getUserByFilter(filter: UsersFiltesDTO): Promise<User[]>;
    getUserId(id: string): Promise<User>;
    getUserStatus(id: string): Promise<UserStatus>;
    createUser(createUser: createUserDTO): Promise<User>;
    deleteUser(id: string): Promise<void>;
    patchStatus(id: string, status: UserStatus): Promise<UserStatus>;
}
