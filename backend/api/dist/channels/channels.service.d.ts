import { Repository } from "typeorm";
import { Channel } from "./channels.entity";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelPasswordDto, ChannelsDto } from "./dto/channels.dto";
export declare class ChannelsService {
    private ChannelsRepository;
    constructor(ChannelsRepository: Repository<Channel>);
    getChannel(): Promise<Channel[]>;
    getChannelByFilter(filter: ChannelFilteDto): Promise<Channel[]>;
    getChannelId(id: string): Promise<Channel>;
    getChannelPermissions(id: string): Promise<string>;
    getChannelStatus(id: string): Promise<string>;
    createChannel(channelsDto: ChannelsDto, channelPasswordDto: ChannelPasswordDto): Promise<Channel>;
    deleteChannel(id: string): Promise<boolean>;
    editChannel(id: string, ChannelDto: ChannelsDto): Promise<Channel>;
}
