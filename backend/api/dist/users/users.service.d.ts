/// <reference types="multer" />
import { UserStatus, UserGameStatus } from "./users-status.enum";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { AuthCredentialsDto } from "../auth/dto/auth-credentials.dto";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
export declare class UsersService {
    private UserRepository;
    private JwtService;
    constructor(UserRepository: Repository<User>, JwtService: JwtService);
    getUsers(): Promise<User[]>;
    getFriends(): Promise<User[]>;
    getUserByFilter(filter: UsersFiltesDTO): Promise<User[]>;
    getUserId(id: string): Promise<User>;
    getRankedUsers(): Promise<User[]>;
    getFirstName(id: string): Promise<string>;
    getLastName(id: string): Promise<string>;
    getUserName(id: string): Promise<string>;
    getEmail(id: string): Promise<string>;
    getStatus(id: string): Promise<UserStatus>;
    getGameStatus(id: string): Promise<UserGameStatus>;
    getWin(id: string): Promise<number>;
    getLoose(id: string): Promise<number>;
    getRank(id: string): Promise<number>;
    getRatio(id: string): Promise<string>;
    getAvatar(id: string, res: any): Promise<any>;
    getAvatarPath(id: string): Promise<string>;
    createUsers(authCredentialsDto: AuthCredentialsDto): Promise<void>;
    signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<void>;
    addFriend(friend: string): Promise<User>;
    signIn(AuthCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
    }>;
    uploadFile(id: string, file: Express.Multer.File): Promise<{
        originalname: string;
        filename: string;
    }>;
    deleteUser(id: string): Promise<void>;
    deleteAvatar(id: string): Promise<void>;
    patchFirstName(id: string, first_name: string): Promise<string>;
    patchLastName(id: string, last_name: string): Promise<string>;
    patchUserName(id: string, user_name: string): Promise<string>;
    patchEmail(id: string, email: string): Promise<string>;
    patchStatus(id: string, status: UserStatus): Promise<UserStatus>;
    patchUserGameStatus(id: string, in_game: UserGameStatus): Promise<UserGameStatus>;
    patchWin(id: string, win: number): Promise<number>;
    patchLoose(id: string, loose: number): Promise<number>;
    patchRank(id: string, rank: number): Promise<number>;
    patchAddWin(id: string): Promise<number>;
    patchAddLoose(id: string): Promise<number>;
    patchRemoveWin(id: string): Promise<number>;
    patchRemoveLoose(id: string): Promise<number>;
    patchUpdateRatio(id: string): Promise<number>;
    patchUpdateRank(): Promise<User[]>;
}
