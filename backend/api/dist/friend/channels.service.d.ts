import { Repository } from 'typeorm';
import { Channel } from './channels.entity';
export declare class ChannelsService {
    private ChannelsRepository;
    constructor(ChannelsRepository: Repository<Channel>);
}
