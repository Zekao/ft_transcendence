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
  name: string;
}
