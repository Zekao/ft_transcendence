import { createUserDTO } from './dto/create-user.dto';
import { UsersFiltesDTO } from './dto/user-filter.dto';
import { UserStatus } from './users-status.enum';
import { User } from './users.entity';
import { UsersService } from './users.service';
export declare class UsersController {
    private UsersService;
    constructor(UsersService: UsersService);
    getUsers(filters: UsersFiltesDTO): Promise<User[]>;
    getUserId(id: string): Promise<User>;
    getUserStatus(id: string): Promise<UserStatus>;
    createUser(createUser: createUserDTO): Promise<User>;
    deleteUser(id: string): Promise<void>;
    patchStatus(id: string, query: any): Promise<UserStatus>;
}
