import { MatchStatus } from "../matches.enum";
export declare class MatchsFilteDto {
    FirstPlayer?: string;
    SecondPlayer?: string;
    scoreFirstPlayer?: number;
    scoreSecondPlayer?: number;
    winner?: string;
    status?: MatchStatus;
}
