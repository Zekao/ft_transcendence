import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    adventureTime(): string;
    Caractere(name: string): string;
    getHello(): string;
}
