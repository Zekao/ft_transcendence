import { User } from "../users/users.entity";
import { MatchStatus } from "./matches.enum";
export declare class Matches {
    id: string;
    FirstPlayer: string;
    SecondPlayer: string;
    scoreFirstPlayer: number;
    scoreSecondPlayer: number;
    winner: string;
    MatchStatus: MatchStatus;
    player: User[];
}
