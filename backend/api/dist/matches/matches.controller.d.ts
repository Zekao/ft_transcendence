import { MatchesFilteDto } from "./dto/matches-filter.dto";
import { MatchesService } from "./matches.service";
export declare class MatchesController {
    private matchService;
    constructor(matchService: MatchesService);
    getMatches(filters: MatchesFilteDto): Promise<void>;
}
