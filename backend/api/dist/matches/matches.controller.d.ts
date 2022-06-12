import { MatchesFilteDto } from "./dto/matches-filter.dto";
import { Matches } from "./matches.entity";
import { MatchesService } from "./matches.service";
import { MatchDto } from "./dto/matches.dto";
export declare class MatchesController {
    private matchService;
    constructor(matchService: MatchesService);
    getMatches(filters: MatchesFilteDto): Promise<Matches[]>;
    createMatch(req: any): Promise<Matches>;
    addUserToMatchMatch(req: any, id: string): Promise<Matches>;
    deleteUser(id: string): Promise<boolean>;
    editChannel(id: string, edit: MatchDto): Promise<Matches>;
}
