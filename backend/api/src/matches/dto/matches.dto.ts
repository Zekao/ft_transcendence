import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  Matches,
} from "class-validator";

export class MatchDto {
  FirstPlayer: string;
  SecondPlayer: string;
  scoreFirstPlayer: number;
  scoreSecondPlayer: number;
  winner: string;
}