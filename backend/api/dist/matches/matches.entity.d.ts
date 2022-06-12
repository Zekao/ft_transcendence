import { User } from "../users/users.entity";
export declare class Matches {
    id: string;
    FirstPlayer: string;
    SecondPlayer: string;
    scoreFirstPlayer: number;
    scoreSecondPlayer: number;
    winner: string;
    player: User[];
}
