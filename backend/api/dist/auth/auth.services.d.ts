import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";
import { AuthCredentialsDto, AuthCredentialsFortyTwoDto, LoginFortyTwoDto } from "./dto/auth-credentials.dto";
import { Repository } from "typeorm";
import { FortyTwoUser } from "./interface/42.interface";
import { QRObjects } from "./dto/2fa.dto";
import { Socket } from "socket.io";
export declare class AuthService {
    private jwtService;
    private userRepository;
    private userService;
    constructor(jwtService: JwtService, userRepository: Repository<User>, userService: UsersService);
    GenerateJwtToken(FortyTwoID: number, firstime: boolean): {
        accessToken: string;
        firstime: boolean;
    };
    GenerateGToken(Gtoken: number): {
        gtoken: string;
    };
    verifyJwtToken(token: string): Promise<FortyTwoUser>;
    handleFortyTwo(Ftwo: AuthCredentialsFortyTwoDto): Promise<any>;
    signIn(loginFortyTwoDto: LoginFortyTwoDto): Promise<void>;
    signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<void>;
    generateRandomUser(): Promise<void>;
    getUserFromSocket(client: Socket): Promise<User>;
    verifyGToken(user_token: string, user: User): Promise<boolean>;
    generateQR(id: User): Promise<QRObjects>;
    verifyQR(user_token: string, user: User): Promise<boolean>;
}
