import { User } from "../users/users.entity";
import { MatchStatus } from "./matchs.enum";
export declare class Matchs {
    id: string;
    FirstPlayer: User;
    SecondPlayer: User;
    scoreFirstPlayer: number;
    scoreSecondPlayer: number;
    posFirstPlayer: number;
    posSecondPlayer: number;
    posBallx: number;
    posBally: number;
    winner: User;
    status: MatchStatus;
    specs: User[];
}
