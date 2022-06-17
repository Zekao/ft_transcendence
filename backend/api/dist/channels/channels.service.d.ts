import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { Channel } from "./channels.entity";
import { ChannelFilteDto, ChannelMembersDto, ChannelStatusDto } from "./dto/channels-filter.dto";
import { ChannelPasswordDto, ChannelsDto } from "./dto/channels.dto";
import { User } from "src/users/users.entity";
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
    getChannel(StatusDto?: ChannelStatusDto): Promise<Channel[]>;
    getChannelByFilter(filter: ChannelFilteDto): Promise<Channel[]>;
    getChannelId(id: string, RelationsPicker?: ChannelRelationsPicker[]): Promise<Channel>;
    getChannelMembers(channelId: string, Role?: ChannelMembersDto): Promise<User[]>;
    getChannelBanMembers(channelId: string): Promise<User[]>;
    getChannelHistory(id: string): Promise<{
        login: string;
        message: string;
    }[]>;
    saveChannel(id: Channel): Promise<boolean>;
    createChannel(id: string, channelsDto: ChannelsDto): Promise<Channel>;
    validateChannelPassword(id: string, channelPasswordDto: ChannelPasswordDto): Promise<Channel>;
    addUserToMember(me: string, channelId: string, channelMembers: ChannelMembersDto): Promise<User>;
    addUserToAdmin(me: string, channelId: string, channelMembers: ChannelMembersDto): Promise<User>;
    addUserToMuted(me: string, channelId: string, channelMembers: ChannelMembersDto): Promise<User>;
    addUserToBanned(me: string, channelId: string, channelMembers: ChannelMembersDto): Promise<User>;
    deleteChannel(id: string): Promise<boolean>;
    deleteChannelMember(me: string, channelId: string, channelMembers: ChannelMembersDto): Promise<User>;
    deleteChannelAdmin(me: string, channelId: string, channelMembers: ChannelMembersDto): Promise<User>;
    deleteChannelMute(me: string, channelId: string, channelMembers: ChannelMembersDto): Promise<User>;
    deleteChannelBan(me: string, channelId: string, channelMembers: ChannelMembersDto): Promise<User>;
    editChannel(id: string, ChannelDto: ChannelsDto): Promise<Channel>;
}
