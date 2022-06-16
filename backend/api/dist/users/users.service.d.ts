/// <reference types="multer" />
import { UserStatus, UserGameStatus } from "./users.enum";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { AuthCredentialsDto } from "../auth/dto/auth-credentials.dto";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "./dto/user.dto";
import { MatchsService } from "../matchs/matchs.service";
import { Matchs } from "../matchs/matchs.entity";
export declare class UserRelationsPicker {
    withFriends?: boolean;
    withBlocked?: boolean;
    withMatchs?: boolean;
    withChannels?: boolean;
}
export declare class UsersService {
    private UserRepository;
    private MatchsService;
    private JwtService;
    constructor(UserRepository: Repository<User>, MatchsService: MatchsService, JwtService: JwtService);
    getUsers(RelationsPicker?: UserRelationsPicker[]): Promise<User[]>;
    getUserFortyTwo(FortyTwoID: number): Promise<User>;
    getFriends(id: string): Promise<UserDto[]>;
    getMatchs(id: string): Promise<Matchs[]>;
    getBlocked(id: string): Promise<UserDto[]>;
    getUserByFilter(filter: UsersFiltesDTO): Promise<User[]>;
    getUserId(id: string, RelationsPicker?: UserRelationsPicker[]): Promise<User>;
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
    saveUser(user: User): Promise<boolean>;
    getWhoFollowMe(id: string): Promise<User[]>;
    getWhoBlockMe(id: string): Promise<User[]>;
    createUsers(authCredentialsDto: AuthCredentialsDto): Promise<void>;
    addFriend(id: string, friend_id: string): Promise<User>;
    addBlocked(id: string, blockedUsersId: string): Promise<User>;
    uploadFile(id: User, file: Express.Multer.File): Promise<{
        originalname: string;
        filename: string;
    }>;
    deleteUser(id: string): Promise<boolean>;
    deleteAvatar(id: string): Promise<boolean>;
    deleteAvatarID(user: User): Promise<boolean>;
    removeFriend(id: string, friend_id: string): Promise<User>;
    removeBlocked(id: string, blockedUserId: string): Promise<User>;
    patchUser(id: string, body: UsersFiltesDTO): Promise<User>;
    patchUpdateRank(): Promise<User[]>;
}
