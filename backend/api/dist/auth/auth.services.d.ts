import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private JwtService;
    constructor(JwtService: JwtService);
    GenerateJwtToken(User: any): void;
}
