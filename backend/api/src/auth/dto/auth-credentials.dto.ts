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
  @ApiProperty()
  FortyTwoID: number;
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
}

export class AuthCredentialsFortyTwoDto {
  id: number;
  first_name: string;
  last_name: string;
  login: string;
  email: string;
  image_url: string;
}

export class LoginFortyTwoDto {
  FortyTwoID: number;
}
