import { Channel } from "./channels.entity";
import { ChannelsService } from "./channels.service";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelsDto } from "./dto/channels.dto";
export declare class ChannelsController {
    private channelService;
    constructor(channelService: ChannelsService);
    GetAllChannel(filters: ChannelFilteDto): Promise<Channel[]>;
    getChannel(id: string): Promise<Channel>;
    getHistory(id: string): Promise<{
        login: string;
        message: string;
    }[]>;
    getChannelPassword(id: string, body: any): Promise<Channel>;
    createChannel(ChannelsDtos: ChannelsDto): Promise<Channel>;
    deleteUser(id: string): Promise<boolean>;
    editChannel(id: string, edit: ChannelsDto): Promise<Channel>;
}
