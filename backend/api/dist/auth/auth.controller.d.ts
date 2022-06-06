import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(AuthCredentialsDto: AuthCredentialsDto): Promise<void>;
    signin(AuthCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
    }>;
    test(req: any): void;
}
