import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  Matches,
} from "class-validator";
import { ChannelPermissions, ChannelStatus } from "../channels.enum";

export class ChannelsDto {
  @IsEnum(ChannelPermissions, {
    message: "permissions must be: ON_INVITE, OPEN",
  })
  @IsNotEmpty()
  @ApiProperty()
  permissions: ChannelPermissions;
  @IsEnum(ChannelStatus, {
    message: "status must be: PRIVATE, PUBLIC",
  })
  @IsNotEmpty()
  @ApiProperty()
  status: ChannelStatus;
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  @ApiProperty()
  name: string;
}

export class ChannelPasswordDto {
  @IsString()
  @MinLength(12)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password is too weak",
  })
  @ApiProperty()
  password: string;
}
