import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
} from "class-validator";
import { UserDto } from "../../users/dto/user.dto";
import { Matches } from "../matches.entity";

export class MatchDto {
  constructor(match?: Matches) {
    if (match) {
      this.id = match.id;
      this.FirstPlayer = match.FirstPlayer;
      this.SecondPlayer = match.SecondPlayer;
      this.scoreFirstPlayer = match.scoreFirstPlayer;
      this.scoreSecondPlayer = match.scoreSecondPlayer;
      this.winner = match.winner;
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
  player: UserDto[];
}
