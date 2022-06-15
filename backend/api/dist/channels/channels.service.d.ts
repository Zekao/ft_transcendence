import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { Channel } from "./channels.entity";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelPasswordDto, ChannelsDto } from "./dto/channels.dto";
export declare class ChannelRelationsPicker {
    withAllMembers?: boolean;
    withMembersOnly?: boolean;
    withAdminOnly?: boolean;
    withOwnerOnly?: boolean;
    withMuted?: boolean;
    withBanned?: boolean;
}
export declare class ChannelsService {
    private ChannelsRepository;
    private UsersService;
    constructor(ChannelsRepository: Repository<Channel>, UsersService: UsersService);
    getChannel(): Promise<Channel[]>;
    getChannelByFilter(filter: ChannelFilteDto): Promise<Channel[]>;
    getChannelId(id: string, RelationsPicker?: ChannelRelationsPicker[]): Promise<Channel>;
    getChannelHistory(id: string): Promise<{
        login: string;
        message: string;
    }[]>;
    saveChannel(id: Channel): Promise<boolean>;
    createChannel(channelsDto: ChannelsDto): Promise<Channel>;
    validateChannelPassword(id: string, channelPasswordDto: ChannelPasswordDto): Promise<Channel>;
    deleteChannel(id: string): Promise<boolean>;
    editChannel(id: string, ChannelDto: ChannelsDto): Promise<Channel>;
}
