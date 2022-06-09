import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { MetadataAlreadyExistsError } from "typeorm";

export class AuthCredentialsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  user_name: string;
  email: string;
  @IsString()
  @MinLength(12)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password is too weak",
  })
  password: string;
}
