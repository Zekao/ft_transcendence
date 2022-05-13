import { User, UserStatus } from './users.model';
import { createUserDTO } from './dto/create-user.dto';
import { UsersFiltesDTO } from './dto/user-filter.dto';
export declare class UsersService {
    private users;
    getUsers(): User[];
    getUserByFilter(filter: UsersFiltesDTO): User[];
    getUserId(id: string): User;
    getUserStatus(id: string): UserStatus;
    createUser(createUser: createUserDTO): User;
    addFriend(userId: string, friendId: string): User;
    deleteUser(id: string): User;
    patchStatus(id: string, status: UserStatus): User;
}
