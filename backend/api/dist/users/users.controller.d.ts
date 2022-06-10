/// <reference types="multer" />
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { UserGameStatus, UserStatus } from "./users-status.enum";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
export declare class UsersController {
    private UsersService;
    constructor(UsersService: UsersService);
    getUsers(filters: UsersFiltesDTO): Promise<User[]>;
    getRankedUsers(): Promise<User[]>;
    getProfile(req: any): any;
    getUserId(id: string): Promise<User>;
    getFirstName(id: string): Promise<string>;
    getLastName(id: string): Promise<string>;
    getUserName(id: string): Promise<string>;
    getEmail(id: string): Promise<string>;
    getStatus(id: string): Promise<UserStatus>;
    getInGame(id: string): Promise<UserGameStatus>;
    getWin(id: string): Promise<number>;
    getLoose(id: string): Promise<number>;
    getRank(id: string): Promise<number>;
    getRatio(id: string): Promise<string>;
    getAvatar(id: string, res: any): Promise<any>;
    uploadedFile(id: string, file: Express.Multer.File): Promise<{
        originalname: string;
        filename: string;
    }>;
    deleteUser(id: string): Promise<boolean>;
    deleteAvatar(id: string): Promise<boolean>;
    patchFirstName(id: string, query: any): Promise<string>;
    patchLastName(id: string, query: any): Promise<string>;
    patchUserName(id: string, query: any): Promise<string>;
    patchEmail(id: string, query: any): Promise<string>;
    patchStatus(id: string, query: any): Promise<UserStatus>;
    patchGameStatus(id: string, query: any): Promise<UserGameStatus>;
    patchWin(id: string, query: number): Promise<number>;
    patchLoose(id: string, query: number): Promise<number>;
    patchRank(id: string, query: number): Promise<number>;
    patchAddWin(id: any): Promise<number>;
    patchAddLoose(id: any): Promise<number>;
    patchRemoveWin(id: any): Promise<number>;
    patchRemoveLoose(id: any): Promise<number>;
    patchUpdateRatio(id: any): Promise<number>;
    patchUpdateRank(): Promise<User[]>;
}
