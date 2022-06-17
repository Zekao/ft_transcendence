import { AuthService } from "./auth.services";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    logfortytwo(req: any): void;
    callbackfortytwo(req: any): {
        accessToken: string;
        firstime: boolean;
    };
    generateRandom(): Promise<{
        accessToken: any;
        firstime: any;
    }>;
    verifyGToken(body: any): Promise<boolean>;
    verifyQrCode(req: any, query: any): Promise<{
        gtoken: string;
    }>;
    qrcode(req: any): Promise<boolean>;
}
