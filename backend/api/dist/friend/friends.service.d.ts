import { Repository } from "typeorm";
import { Friend } from "./friends.entity";
export declare class FriendsService {
    private FriendsRepository;
    constructor(FriendsRepository: Repository<Friend>);
}
