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
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  @IsString()
  @MinLength(12)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password is too weak",
  })
  password: string;
}

export class AuthCredentialsFortyTwoDto {
  first_name: string;
  last_name: string;
  login: string;
  email: string;
  image_url: string;
}
