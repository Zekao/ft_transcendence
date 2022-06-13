import { Repository } from "typeorm";
import { Matchs } from "./matches.entity";
import { MatchsFilteDto } from "./dto/matches-filter.dto";
import { MatchDto } from "./dto/matches.dto";
import { UsersService } from "../users/users.service";
import { User } from "../users/users.entity";
export declare class MatchsService {
    private matchesRepository;
    private userService;
    constructor(matchesRepository: Repository<Matchs>, userService: UsersService);
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
