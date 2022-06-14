import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { Channel } from "./channels.entity";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelPasswordDto, ChannelsDto } from "./dto/channels.dto";
export declare class ChannelsService {
    private ChannelsRepository;
    private UsersService;
    constructor(ChannelsRepository: Repository<Channel>, UsersService: UsersService);
    getChannel(): Promise<Channel[]>;
    getChannelByFilter(filter: ChannelFilteDto): Promise<Channel[]>;
    getChannelId(id: string): Promise<Channel>;
    getChannelPermissions(id: string): Promise<string>;
    getChannelStatus(id: string): Promise<string>;
    getChannelHistory(id: string): Promise<string[]>;
    saveChannel(id: Channel): Promise<boolean>;
    createChannel(channelsDto: ChannelsDto, channelPasswordDto: ChannelPasswordDto): Promise<Channel>;
    deleteChannel(id: string): Promise<boolean>;
    editChannel(id: string, ChannelDto: ChannelsDto): Promise<Channel>;
}
