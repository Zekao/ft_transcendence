import { Repository } from "typeorm";
import { Matches } from "./matches.entity";
import { MatchesFilteDto } from "./dto/matches-filter.dto";
import { MatchDto } from "./dto/matches.dto";
export declare class MatchesService {
    private matchesRepository;
    constructor(matchesRepository: Repository<Matches>);
    getMatches(): Promise<Matches[]>;
    getMatchesByFilter(filter: MatchesFilteDto): Promise<Matches[]>;
    getMatchesId(id: string): Promise<Matches>;
    createMatch(matchDto: MatchDto): Promise<Matches>;
    deleteMatch(id: string): Promise<boolean>;
    editMatch(id: string, matchDto: MatchDto): Promise<Matches>;
}
