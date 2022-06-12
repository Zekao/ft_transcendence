import { Repository } from "typeorm";
import { Matches } from "./matches.entity";
import { MatchesFilteDto } from "./dto/matches-filter.dto";
import { MatchDto } from "./dto/matches.dto";
import { UsersService } from "../users/users.service";
import { User } from "../users/users.entity";
export declare class MatchesService {
    private matchesRepository;
    private userService;
    constructor(matchesRepository: Repository<Matches>, userService: UsersService);
    getMatches(): Promise<Matches[]>;
    getMatchesByFilter(filter: MatchesFilteDto): Promise<Matches[]>;
    getMatchesId(id: string): Promise<Matches>;
    createMatch(user: User): Promise<Matches>;
    addMatchToPlayer(player: User, match: Matches): Promise<Matches>;
    addPlayerToMatch(player: User, match: Matches): Promise<Matches>;
    findMatch(): Promise<Matches>;
    defineMatch(id: string): Promise<Matches>;
    deleteMatch(id: string): Promise<boolean>;
    editMatch(id: string, matchDto: MatchDto): Promise<Matches>;
}
