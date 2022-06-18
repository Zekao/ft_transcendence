import { User } from "src/users/users.entity";
import { Channel } from "./channels.entity";
import { ChannelsService } from "./channels.service";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelsDto } from "./dto/channels.dto";
export declare class ChannelsController {
    private channelService;
    constructor(channelService: ChannelsService);
    GetAllChannel(filters: ChannelFilteDto): Promise<Channel[]>;
    getChannelMembers(id: string, query?: any): Promise<User[]>;
    getChannel(id: string): Promise<Channel>;
    getHistory(id: string): Promise<{
        login: string;
        message: string;
    }[]>;
    getChannelPassword(id: string, body: any): Promise<Channel>;
    createChannel(req: any, ChannelsDtos: ChannelsDto): Promise<Channel>;
    addUserToMember(req: any, id: string, query: any): Promise<User>;
    addUserToAdmin(req: any, id: string, query: any): Promise<User>;
    addUserToMuted(req: any, id: string, query: any): Promise<User>;
    addUserToBanned(req: any, id: string, query: any): Promise<User>;
    deleteUser(id: string): Promise<boolean>;
    removeUserToMember(req: any, id: string, query: any): Promise<User>;
    removeUserToAdmin(req: any, id: string, query: any): Promise<User>;
    removeUserToMuted(req: any, id: string, query: any): Promise<User>;
    removeUserToBanned(req: any, id: string, query: any): Promise<User>;
    editChannel(id: string, edit: any): Promise<Channel>;
}
