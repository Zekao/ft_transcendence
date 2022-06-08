import { ChannelPermissions, ChannelStatus } from "./friends.enum";
export declare class Channel {
    id: string;
    name: string;
    status: ChannelStatus;
    permissions: ChannelPermissions;
}
