import { createUserDTO } from './dto/create-user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';
export declare class UsersController {
    private UsersService;
    constructor(UsersService: UsersService);
    getUserId(id: string): Promise<User>;
    createUser(createUser: createUserDTO): Promise<User>;
}
