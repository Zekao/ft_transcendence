import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "../users/users.entity";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
export declare class AuthService {
    private UsersRepository;
    private JwtService;
    constructor(UsersRepository: Repository<User>, JwtService: JwtService);
    signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<void>;
    signIn(AuthCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
    }>;
}
