import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { UsersRepository } from "./users.repository";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private UsersRepository;
    private JwtService;
    constructor(UsersRepository: UsersRepository, JwtService: JwtService);
    signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<void>;
    signIn(AuthCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
    }>;
}
