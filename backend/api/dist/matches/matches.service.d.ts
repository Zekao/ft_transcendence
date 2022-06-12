import { Repository } from "typeorm";
import { Matches } from "./matches.entity";
export declare class MatchesService {
    private matchesRepository;
    constructor(matchesRepository: Repository<Matches>);
}
