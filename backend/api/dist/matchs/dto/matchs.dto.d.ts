import { UserDto } from "../../users/dto/user.dto";
import { Matchs } from "../matchs.entity";
import { MatchStatus } from "../matchs.enum";
export declare class MatchDto {
    constructor(match?: Matchs);
    id: string;
    FirstPlayer: UserDto;
    SecondPlayer: UserDto;
    scoreFirstPlayer: number;
    scoreSecondPlayer: number;
    winner: UserDto;
    status: MatchStatus;
    specs: UserDto[];
}
