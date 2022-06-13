import { UserDto } from "../../users/dto/user.dto";
import { Matchs } from "../matchs.entity";
import { MatchStatus } from "../matchs.enum";
export declare class MatchDto {
    constructor(match?: Matchs);
    id: string;
    FirstPlayer: string;
    SecondPlayer: string;
    scoreFirstPlayer: number;
    scoreSecondPlayer: number;
    winner: string;
    status: MatchStatus;
    player: UserDto[];
}
