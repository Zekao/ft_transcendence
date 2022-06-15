import { User } from "../users/users.entity";
import { MatchStatus } from "./matchs.enum";
export declare class Matchs {
    id: string;
    FirstPlayer: string;
    SecondPlayer: string;
    scoreFirstPlayer: number;
    scoreSecondPlayer: number;
    winner: string;
    status: MatchStatus;
    player: User[];
}
