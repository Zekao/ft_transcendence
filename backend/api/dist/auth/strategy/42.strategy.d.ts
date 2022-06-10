import { User } from "src/users/users.entity";
import { Repository } from "typeorm";
import { AuthService } from "../auth.services";
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private usersRepository;
    private authService;
    constructor(usersRepository: Repository<User>, authService: AuthService);
    validate(accessToken: any, refreshToken: any, profile: any): Promise<any>;
}
export {};
