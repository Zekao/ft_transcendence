import { ChannelsService } from "./channels.service";
import { ChannelsDto } from "./dto/channels.dto";
export declare class ChannelsController {
    private ChannelService;
    constructor(ChannelService: ChannelsService);
    createChannel(ChannelsDtos: ChannelsDto): Promise<void>;
}
