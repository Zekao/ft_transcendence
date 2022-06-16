import { ChannelStatus, ChannelPermissions } from "../channels.enum";
export declare class ChannelFilteDto {
    name?: string;
    status?: ChannelStatus;
    permissions?: ChannelPermissions;
}
export declare class ChannelStatusDto {
    status: ChannelStatus;
}
export declare class ChannelMembersDto {
    role: string;
    id: string;
    user: string;
}
