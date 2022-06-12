/// <reference types="multer" />
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { UserGameStatus, UserStatus } from "./users.enum";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
import { UserDto } from "./dto/user.dto";
export declare class UsersController {
    private UsersService;
    constructor(UsersService: UsersService);
    getUsers(filters: UsersFiltesDTO): Promise<User[]>;
    getRankedUsers(): Promise<User[]>;
    getProfile(req: any): any;
    getUserId(req: any, id: string): Promise<User>;
    getFirstName(req: any, id: string): Promise<string>;
    getLastName(req: any, id: string): Promise<string>;
    getUserName(req: any, id: string): Promise<string>;
    getEmail(req: any, id: string): Promise<string>;
    getStatus(req: any, id: string): Promise<UserStatus>;
    getInGame(req: any, id: string): Promise<UserGameStatus>;
    getWin(req: any, id: string): Promise<number>;
    getLoose(req: any, id: string): Promise<number>;
    getRank(req: any, id: string): Promise<number>;
    getRatio(req: any, id: string): Promise<string>;
    getAvatar(req: any, id: string, res: any): Promise<any>;
    getFriends(req: any, id: string): Promise<UserDto[]>;
    addFriend(req: any, id: string, query: any): Promise<User>;
    uploadedFile(req: any, id: string, file: Express.Multer.File): Promise<{
        originalname: string;
        filename: string;
    }>;
    deleteUser(req: any, id: string): Promise<boolean>;
    deleteAvatar(req: any, id: string): Promise<boolean>;
    removeFriend(req: any, id: string, query: any): Promise<User>;
    patchUser(req: any, id: string, query: any): Promise<User>;
    patchUpdateRank(): Promise<User[]>;
}
