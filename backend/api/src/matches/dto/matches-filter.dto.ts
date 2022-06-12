import { MatchStatus } from "../matches.enum";

export class MatchesFilteDto {
  FirstPlayer?: string;
  SecondPlayer?: string;
  scoreFirstPlayer?: number;
  scoreSecondPlayer?: number;
  winner?: string;
  status?: MatchStatus;
}
