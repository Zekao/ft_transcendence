import { Channel } from "./channels.entity";
import { ChannelsService } from "./channels.service";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelPasswordDto, ChannelsDto } from "./dto/channels.dto";
export declare class ChannelsController {
    private channelService;
    constructor(channelService: ChannelsService);
    getUsers(filters: ChannelFilteDto): Promise<Channel[]>;
    getHistory(id: string): Promise<string[]>;
    createChannel(ChannelsDtos: ChannelsDto, channelPasswordDto: ChannelPasswordDto): Promise<Channel>;
    deleteUser(id: string): Promise<boolean>;
    editChannel(id: string, edit: ChannelsDto): Promise<Channel>;
}
