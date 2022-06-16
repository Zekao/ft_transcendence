import { Repository } from "typeorm";
import { Chat } from "./chat.entity";
export declare class ChatRelationPicker {
    withParticipants?: boolean;
}
export declare class ChatService {
    private chatRepository;
    constructor(chatRepository: Repository<Chat>);
    GetMessage(): Promise<Chat[]>;
    GetMessageID(id: string, RelationsPicker?: ChatRelationPicker[]): Promise<Chat>;
}
