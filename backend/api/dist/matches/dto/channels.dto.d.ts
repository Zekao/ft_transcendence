import { ChannelPermissions, ChannelStatus } from "../channels.enum";
export declare class ChannelsDto {
    permissions: ChannelPermissions;
    status: ChannelStatus;
    name: string;
}
export declare class ChannelPasswordDto {
    password: string;
}
