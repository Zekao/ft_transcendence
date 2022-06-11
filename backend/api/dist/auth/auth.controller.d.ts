import { AuthService } from "./auth.services";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    logfortytwo(req: any): void;
    callbackfortytwo(req: any): {
        accessToken: string;
    };
    test(req: any): void;
    qrcode(): Promise<void>;
}
