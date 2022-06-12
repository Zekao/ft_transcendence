import { gameStatus } from "./matches.enum";
export declare class Matches {
    id: string;
    in_game: gameStatus;
    win: number;
    loose: number;
    rank: number;
    ratio: number;
    users: Matches[];
}
