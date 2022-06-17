import { ChannelStatus, ChannelPermissions } from "../channels.enum";

export class ChannelFilteDto {
  name?: string;
  status?: ChannelStatus;
  permissions?: ChannelPermissions;
}

export class ChannelStatusDto {
  status: ChannelStatus;
}

export class ChannelMembersDto {
  user: string;
  role: string;
  id: string;
}
