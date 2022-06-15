import { Repository } from "typeorm";
import { Matchs } from "./matchs.entity";
import { MatchsFilteDto } from "./dto/matchs-filter.dto";
import { MatchDto } from "./dto/matchs.dto";
import { UsersService } from "../users/users.service";
import { User } from "../users/users.entity";
export declare class MatchsRelationPicker {
    withUsers?: boolean;
}
export declare class MatchsService {
    private MatchsRepository;
    private userService;
    constructor(MatchsRepository: Repository<Matchs>, userService: UsersService);
    getMatchs(): Promise<Matchs[]>;
    getMatchsByFilter(filter: MatchsFilteDto): Promise<Matchs[]>;
    getMatchsId(id: any, RelationsPicker?: MatchsRelationPicker[]): Promise<Matchs>;
    getPosFirstPlayer(id: Matchs): Promise<number>;
    getPosSecondPlayer(id: Matchs): Promise<number>;
    setPosFirstPlayer(id: Matchs, pos: number): Promise<boolean>;
    setPosSecondPlayer(id: Matchs, pos: number): Promise<boolean>;
    createMatch(id: string): Promise<Matchs>;
    addPlayerToMatch(player: User, match: Matchs): Promise<Matchs>;
    defineMatch(player: User): Promise<Matchs>;
    deleteMatch(id: string): Promise<boolean>;
    editMatch(id: string, matchDto: MatchDto): Promise<Matchs>;
}
