/// <reference types="multer" />
import { UserStatus, UserGameStatus } from "./users.enum";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { AuthCredentialsDto } from "../auth/dto/auth-credentials.dto";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "./dto/user.dto";
export declare class UserRelationsPicker {
    withFriends?: boolean;
    withBlocked?: boolean;
    myMatches?: boolean;
}
export declare class UsersService {
    private UserRepository;
    private JwtService;
    constructor(UserRepository: Repository<User>, JwtService: JwtService);
    getUsers(): Promise<User[]>;
    getUserFortyTwo(FortyTwoID: number): Promise<User>;
    getFriends(id: string): Promise<UserDto[]>;
    getBlocked(id: string): Promise<UserDto[]>;
    getUserByFilter(filter: UsersFiltesDTO): Promise<User[]>;
    getUserId(id: string, RelationsPicker?: UserRelationsPicker): Promise<User>;
    getRankedUsers(): Promise<User[]>;
    getFirstName(id: string): Promise<string>;
    getLastName(id: string): Promise<string>;
    getDisplayName(id: string): Promise<string>;
    getUserName(id: string): Promise<string>;
    getEmail(id: string): Promise<string>;
    getStatus(id: string): Promise<UserStatus>;
    getGameStatus(id: string): Promise<UserGameStatus>;
    getWin(id: string): Promise<number>;
    getLoose(id: string): Promise<number>;
    getRank(id: string): Promise<number>;
    getRatio(id: string): Promise<string>;
    getAvatar(id: string, res: any): Promise<any>;
    createUsers(authCredentialsDto: AuthCredentialsDto): Promise<void>;
    addFriend(id: string, friend_id: string): Promise<User>;
    addBlocked(id: string, blockedUsersId: string): Promise<User>;
    uploadFile(id: User, file: Express.Multer.File): Promise<{
        originalname: string;
        filename: string;
    }>;
    deleteUser(id: string): Promise<boolean>;
    deleteAvatar(id: string): Promise<boolean>;
    removeFriend(id: string, friend_id: string): Promise<User>;
    removeBlocked(id: string, blockedUsersId: string): Promise<User>;
    patchUser(id: string, body: UsersFiltesDTO): Promise<User>;
    patchUpdateRank(): Promise<User[]>;
}
