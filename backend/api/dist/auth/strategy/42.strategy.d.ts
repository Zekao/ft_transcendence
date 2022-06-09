import { User } from "src/users/users.entity";
import { Repository } from "typeorm";
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    validate(accessToken: any, refreshToken: any, profile: any): Promise<any>;
}
export {};
