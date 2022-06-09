import { JwtPayload } from "../interface/jwt-payload.interface";
import { User } from "../../users/users.entity";
import { Repository } from "typeorm";
import { UsersService } from "../../users/users.service";
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersRepository;
    private readonly userService;
    constructor(usersRepository: Repository<User>, userService: UsersService);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
