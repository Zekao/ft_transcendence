import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MetadataAlreadyExistsError } from "typeorm";

export class AuthCredentialsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  @ApiProperty()
  user_name: string;
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  avatar: string;
  @IsString()
  @MinLength(12)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password is too weak",
  })
  @ApiProperty()
  password: string;
}

export class AuthCredentialsFortyTwoDto {
  first_name: string;
  last_name: string;
  login: string;
  email: string;
  image_url: string;
}
