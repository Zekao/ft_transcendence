import { User } from "src/users/users.entity";
import { MatchStatus } from "../matchs.enum";
export declare class MatchsFilteDto {
    FirstPlayer?: User;
    SecondPlayer?: User;
    scoreFirstPlayer?: number;
    scoreSecondPlayer?: number;
    winner?: User;
    status?: MatchStatus;
}
