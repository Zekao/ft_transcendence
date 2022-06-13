import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  Matches,
} from "class-validator";
import { Channel } from "../channels.entity";
import { UserDto } from "src/users/dto/user.dto";
import { ChannelPermissions, ChannelStatus } from "../channels.enum";

export class ChannelsDto {

  constructor(channel?: Channel) {
    if (channel) {
      this.id = channel.id;
      this.name = channel.name;
      this.status = channel.status;
      this.permissions = channel.permissions;
      this.password = channel.password;
      this.members = channel.members;
      this.admins = channel.admins;
      this.owner = channel.owner;
    }
  }


  @IsNotEmpty()
  @ApiProperty()
  id: string;

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

  @ApiProperty()
  password: string;

  @ApiProperty()
  members: UserDto[];

  @ApiProperty()
  admins: UserDto[];

  @ApiProperty({ type: () => UserDto })
  owner: UserDto;
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
