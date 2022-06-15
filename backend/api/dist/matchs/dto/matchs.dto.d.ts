import { User } from "src/users/users.entity";
import { UserDto } from "../../users/dto/user.dto";
import { Matchs } from "../matchs.entity";
import { MatchStatus } from "../matchs.enum";
export declare class MatchDto {
    constructor(match?: Matchs);
    id: string;
    FirstPlayer: User;
    SecondPlayer: User;
    scoreFirstPlayer: number;
    scoreSecondPlayer: number;
    winner: User;
    status: MatchStatus;
    specs: UserDto[];
}
