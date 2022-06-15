import { MatchStatus } from "../matchs.enum";
export declare class MatchsFilteDto {
    FirstPlayer?: string;
    SecondPlayer?: string;
    scoreFirstPlayer?: number;
    scoreSecondPlayer?: number;
    winner?: string;
    status?: MatchStatus;
}
