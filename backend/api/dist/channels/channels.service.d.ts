import { Repository } from "typeorm";
import { Channel } from "./channels.entity";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelsDto } from "./dto/channels.dto";
export declare class ChannelsService {
    private ChannelsRepository;
    constructor(ChannelsRepository: Repository<Channel>);
    getChannel(): Promise<Channel[]>;
    getChannelByFilter(filter: ChannelFilteDto): Promise<Channel[]>;
    getChannelId(id: string): Promise<Channel>;
    getChannelPermissions(id: string): Promise<string>;
    getChannelStatus(id: string): Promise<string>;
    createChannel(channelsDto: ChannelsDto): Promise<void>;
    deleteChannel(id: string): Promise<void>;
}
