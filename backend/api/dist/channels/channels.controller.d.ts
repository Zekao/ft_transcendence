import { Channel } from "./channels.entity";
import { ChannelsService } from "./channels.service";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelsDto } from "./dto/channels.dto";
export declare class ChannelsController {
    private channelService;
    constructor(channelService: ChannelsService);
    getUsers(filters: ChannelFilteDto): Promise<Channel[]>;
    getChannelStatus(id: string): Promise<string>;
    getChannelPermission(id: string): Promise<string>;
    createChannel(ChannelsDtos: ChannelsDto): Promise<void>;
    deleteUser(id: string): Promise<void>;
}
