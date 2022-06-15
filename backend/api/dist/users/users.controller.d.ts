/// <reference types="multer" />
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
import { UserDto } from "./dto/user.dto";
export declare class UsersController {
    private UsersService;
    constructor(UsersService: UsersService);
    getUsers(filters: UsersFiltesDTO): Promise<User[]>;
    getRankedUsers(): Promise<User[]>;
    getUserId(req: any, id: string): Promise<User>;
    getAvatar(req: any, id: string, res: any): Promise<any>;
    getFriends(req: any): Promise<UserDto[]>;
    getMatch(req: any, id: string): Promise<import("../matchs/matchs.entity").Matchs[]>;
    getBlocked(req: any, id: string): Promise<UserDto[]>;
    getWhoFollowMe(req: any): Promise<User[]>;
    addFriend(req: any, query: any): Promise<User>;
    addBlocked(req: any, query: any): Promise<User>;
    uploadedFile(req: any, file: Express.Multer.File): Promise<{
        filename: string;
    }>;
    deleteUser(req: any, id: string): Promise<boolean>;
    deleteAvatar(req: any, id: string): Promise<boolean>;
    removeFriend(req: any, query: any): Promise<User>;
    removeBlocked(req: any, id: string, query: any): Promise<User>;
    patchUser(req: any, id: string, body: any): Promise<User>;
    patchUpdateRank(): Promise<User[]>;
}
