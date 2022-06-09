import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.services";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
export declare class AuthController {
    private userService;
    private authService;
    constructor(userService: UsersService, authService: AuthService);
    signup(AuthCredentialsDto: AuthCredentialsDto): Promise<void>;
    signin(AuthCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
    }>;
    test(req: any): void;
    logfortytwo(req: any): void;
}
