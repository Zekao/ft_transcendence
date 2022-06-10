import { AuthService } from "./auth.services";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    callbackfortytwo(req: any): {
        accessToken: string;
    };
    test(req: any): void;
}
