import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/users.entity";
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
      if (match.specs)
        this.specs = match.specs.map((play) => {
          return new UserDto(play);
        });
    }
  }
  id: string;
  FirstPlayer: User;
  SecondPlayer: User;
  scoreFirstPlayer: number;
  scoreSecondPlayer: number;
  winner: User;
  status: MatchStatus;
  specs: UserDto[];
}
