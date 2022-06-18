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
      this.owner = channel.owner;
      if (channel.members)
        this.members = channel.members.map((member) => {
          return new UserDto(member);
        });
      if (channel.admins)
        this.admins = channel.admins.map((admin) => {
          return new UserDto(admin);
        });
      if (channel.mutedUsers)
        this.mutedUsers = channel.mutedUsers.map((user) => {
          return new UserDto();
        });
      if (channel.bannedUsers)
        this.bannedUsers = channel.bannedUsers.map((user) => {
          return new UserDto();
        });
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
    message: "status must be: PRIVATE, PUBLIC, PROTECTED",
  })
  @IsNotEmpty()
  @ApiProperty()
  status: ChannelStatus;
  @IsString()
  @MinLength(2)
  @MaxLength(24)
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty()
  password: string;

  @ApiProperty()
  members: UserDto[];

  @ApiProperty()
  admins: UserDto[];

  @ApiProperty({ type: () => UserDto })
  owner: User;

  @ApiProperty()
  mutedUsers: UserDto[];

  @ApiProperty()
  bannedUsers: UserDto[];
}

export class ChannelPasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password is too weak",
  })
  @ApiProperty()
  password: string;
}
