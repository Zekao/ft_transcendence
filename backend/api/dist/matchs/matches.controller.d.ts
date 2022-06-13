import { MatchsFilteDto } from "./dto/matches-filter.dto";
import { Matchs } from "./matches.entity";
import { MatchsService } from "./matches.service";
import { MatchDto } from "./dto/matches.dto";
export declare class MatchsController {
    private matchService;
    constructor(matchService: MatchsService);
    getMatchs(filters: MatchsFilteDto): Promise<Matchs[]>;
    createMatch(req: any): Promise<Matchs>;
    addUserToMatchMatch(req: any): Promise<Matchs>;
    deleteUser(id: string): Promise<boolean>;
    editChannel(id: string, edit: MatchDto): Promise<Matchs>;
}
