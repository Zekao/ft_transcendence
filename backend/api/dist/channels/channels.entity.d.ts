import { User } from "src/users/users.entity";
import { ChannelPermissions, ChannelStatus } from "./channels.enum";
export declare class Channel {
    id: string;
    users: User[];
    name: string;
    status: ChannelStatus;
    permissions: ChannelPermissions;
    password: string;
}
