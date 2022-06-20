import { AuthService } from "./auth.services";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    logfortytwo(req: any): void;
    callbackfortytwo(req: any): Promise<{
        accessToken: string;
        firstime: boolean;
    }>;
    verifyGToken(body: any): Promise<boolean>;
    verifyQrCode(req: any, query: any): Promise<{
        gtoken: string;
    }>;
    qrcode(req: any): Promise<boolean>;
}
