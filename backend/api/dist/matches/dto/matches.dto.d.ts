import { UserDto } from "../../users/dto/user.dto";
import { Matches } from "../matches.entity";
import { MatchStatus } from "../matches.enum";
export declare class MatchDto {
    constructor(match?: Matches);
    id: string;
    FirstPlayer: string;
    SecondPlayer: string;
    scoreFirstPlayer: number;
    scoreSecondPlayer: number;
    winner: string;
    status: MatchStatus;
    player: UserDto[];
}
