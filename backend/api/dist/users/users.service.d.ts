import { createUserDTO } from './dto/create-user.dto';
import { User } from './users.entity';
import { Repository } from 'typeorm';
export declare class UsersService {
    private UserRepository;
    constructor(UserRepository: Repository<User>);
    getUser(): Promise<User[]>;
    getUserId(id: string): Promise<User>;
    createUser(createUser: createUserDTO): Promise<User>;
}
