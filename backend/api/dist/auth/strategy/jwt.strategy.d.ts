import { User } from "../../users/users.entity";
import { Repository } from "typeorm";
import { UsersService } from "../../users/users.service";
import { FortyTwoUser } from "../interface/42.interface";
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersRepository;
    private readonly userService;
    constructor(usersRepository: Repository<User>, userService: UsersService);
    validate(payload: FortyTwoUser): Promise<User>;
}
export {};
