import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
} from "class-validator";
import { ChannelPermissions, ChannelStatus } from "../channels.enum";

export class ChannelsDto {
  @IsEnum(ChannelPermissions, {
    message: "permissions must be: ON_INVITE, OPEN",
  })
  @IsNotEmpty()
  permissions: ChannelPermissions;
  @IsEnum(ChannelStatus, {
    message: "status must be: PRIVATE, PUBLIC",
  })
  @IsNotEmpty()
  status: ChannelStatus;
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  name: string;
}