import { createUserDTO } from './dto/create-user.dto';
import { UsersFiltesDTO } from './dto/user-filter.dto';
import { User, UserStatus } from './users.model';
import { UsersService } from './users.service';
export declare class UsersController {
    private UsersService;
    constructor(UsersService: UsersService);
    getUsers(filters: UsersFiltesDTO): User[];
    getUserId(id: string): User;
    getUserStatus(id: string): UserStatus;
    createUser(createUser: createUserDTO): User;
    addFriend(id: string, query: any): User;
    deleteUser(id: string): User;
    patchStatus(id: string, query: any): User;
}
