import { Repository } from "typeorm";
import { Matches } from "./matches.entity";
import { ChannelFilteDto } from "../channels/dto/channels-filter.dto";
export declare class MatchesService {
    private matchesRepository;
    constructor(matchesRepository: Repository<Matches>);
    getMatches(): Promise<Matches[]>;
    getMatchesByFilter(filter: ChannelFilteDto): Promise<Matches[]>;
}
