import { Repository } from "typeorm";
import { Channel } from "./channels.entity";
import { ChannelsDto } from "./dto/channels.dto";
export declare class ChannelsService {
    private ChannelsRepository;
    constructor(ChannelsRepository: Repository<Channel>);
    createChannel(channelsDto: ChannelsDto): Promise<void>;
}
