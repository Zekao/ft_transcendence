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
import { User } from "../../users/users.entity";

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
      if (channel.mutedUsers)
        this.mutedUsers = channel.mutedUsers.map((user) => {return new UserDto()});
      if (channel.bannedUsers)
        this.bannedUsers = channel.bannedUsers.map((user) => {return new UserDto()});
      if (channel.members)
        this.members = channel.members.map((user) => {return new UserDto()});
      if (channel.admins)
        this.admins = channel.admins.map((user) => {return new UserDto()});
      if (channel.owner)
        this.owner = new UserDto(channel.owner);
    }
  }

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
  members: User[];

  @ApiProperty()
  admins: User[];

  @ApiProperty({ type: () => UserDto })
  owner: UserDto;

  @ApiProperty()
  mutedUsers: UserDto[];

  @ApiProperty()
  bannedUsers: UserDto[];
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
