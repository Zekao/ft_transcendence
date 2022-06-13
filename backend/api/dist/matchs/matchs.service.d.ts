import { Repository } from "typeorm";
import { Matchs } from "./matchs.entity";
import { MatchsFilteDto } from "./dto/matchs-filter.dto";
import { MatchDto } from "./dto/matchs.dto";
import { UsersService } from "../users/users.service";
import { User } from "../users/users.entity";
export declare class MatchsService {
    private matchsRepository;
    private userService;
    constructor(matchsRepository: Repository<Matchs>, userService: UsersService);
    getMatchs(): Promise<Matchs[]>;
    getMatchsByFilter(filter: MatchsFilteDto): Promise<Matchs[]>;
    getMatchsId(id: string): Promise<Matchs>;
    createMatch(id: string): Promise<Matchs>;
    addMatchToPlayer(player: User, match: Matchs): Promise<Matchs>;
    addPlayerToMatch(player: User, match: Matchs): Promise<Matchs>;
    findMatch(): Promise<Matchs>;
    defineMatch(player: User): Promise<Matchs>;
    deleteMatch(id: string): Promise<boolean>;
    editMatch(id: string, matchDto: MatchDto): Promise<Matchs>;
}
