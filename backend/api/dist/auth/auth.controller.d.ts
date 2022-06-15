import { AuthService } from "./auth.services";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    logfortytwo(req: any): void;
    callbackfortytwo(req: any): {
        accessToken: string;
    };
    tokenGen(req: any, id: number): {
        accessToken: string;
    };
    qrcode(): Promise<string>;
}
