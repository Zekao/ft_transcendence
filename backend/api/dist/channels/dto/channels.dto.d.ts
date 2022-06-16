import { Channel } from "../channels.entity";
import { UserDto } from "src/users/dto/user.dto";
import { ChannelPermissions, ChannelStatus } from "../channels.enum";
import { User } from "../../users/users.entity";
export declare class ChannelsDto {
    constructor(channel?: Channel);
    id: string;
    permissions: ChannelPermissions;
    status: ChannelStatus;
    name: string;
    password: string;
    members: UserDto[];
    admins: UserDto[];
    owner: User;
    mutedUsers: UserDto[];
    bannedUsers: UserDto[];
}
export declare class ChannelPasswordDto {
    password: string;
}
