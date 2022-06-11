import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";
import { AuthCredentialsDto, AuthCredentialsFortyTwoDto, LoginFortyTwoDto } from "./dto/auth-credentials.dto";
import { Repository } from "typeorm";
export declare class AuthService {
    private JwtService;
    private userRepository;
    private userService;
    constructor(JwtService: JwtService, userRepository: Repository<User>, userService: UsersService);
    GenerateJwtToken(FortyTwoID: number): {
        accessToken: string;
    };
    handleFortyTwo(Ftwo: AuthCredentialsFortyTwoDto): Promise<any>;
    signIn(loginFortyTwoDto: LoginFortyTwoDto): Promise<void>;
    signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<void>;
    generateQR(): Promise<any>;
    verifyQR(user_token: string, qr: any): Promise<any>;
}
