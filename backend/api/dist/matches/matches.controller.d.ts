import { MatchsFilteDto } from "./dto/matchs-filter.dto";
import { Matchs } from "./matchs.entity";
import { MatchsService } from "./matchs.service";
import { MatchDto } from "./dto/matchs.dto";
export declare class MatchsController {
    private matchService;
    constructor(matchService: MatchsService);
    getMatchs(filters: MatchsFilteDto): Promise<Matchs[]>;
    createMatch(req: any): Promise<Matchs>;
    addUserToMatchMatch(req: any): Promise<Matchs>;
    deleteUser(id: string): Promise<boolean>;
    editChannel(id: string, edit: MatchDto): Promise<Matchs>;
}
