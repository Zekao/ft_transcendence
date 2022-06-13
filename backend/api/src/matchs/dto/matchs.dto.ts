import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
} from "class-validator";
import { UserDto } from "../../users/dto/user.dto";
import { Matchs } from "../matchs.entity";
import { MatchStatus } from "../matchs.enum";

export class MatchDto {
  constructor(match?: Matchs) {
    if (match) {
      this.id = match.id;
      this.FirstPlayer = match.FirstPlayer;
      this.SecondPlayer = match.SecondPlayer;
      this.scoreFirstPlayer = match.scoreFirstPlayer;
      this.scoreSecondPlayer = match.scoreSecondPlayer;
      this.winner = match.winner;
      this.status = match.status;
      if (match.player)
        this.player = match.player.map((play) => {
          return new UserDto(play);
        });
    }
  }
  id: string;
  FirstPlayer: string;
  SecondPlayer: string;
  scoreFirstPlayer: number;
  scoreSecondPlayer: number;
  winner: string;
  status: MatchStatus;
  player: UserDto[];
}
