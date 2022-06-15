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
    verifyQrCode(req: any, query: any): Promise<boolean>;
    qrcode(req: any): Promise<boolean>;
}
