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
    getFriends(id: string): Promise<UserDto[]>;
    addFriend(id: string, query: any): Promise<User>;
    uploadedFile(id: string, file: Express.Multer.File): Promise<{
        originalname: string;
        filename: string;
    }>;
    deleteUser(id: string): Promise<boolean>;
    deleteAvatar(id: string): Promise<boolean>;
    removeFriend(id: string, query: any): Promise<User>;
    patchUser(id: string, query: any): Promise<User>;
    patchUpdateRank(): Promise<User[]>;
}
