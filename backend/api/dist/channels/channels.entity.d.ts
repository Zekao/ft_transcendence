import { ChannelPermissions, ChannelStatus } from "./channels.enum";
export declare class Channel {
    id: string;
    name: string;
    status: ChannelStatus;
    permissions: ChannelPermissions;
}
