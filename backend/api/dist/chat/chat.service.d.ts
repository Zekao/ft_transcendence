import { Repository } from "typeorm";
import { User } from "../users/users.entity";
import { Chat } from "./chat.entity";
export declare class ChatService {
    private chatRepository;
    constructor(chatRepository: Repository<Chat>);
    GetMessage(): Promise<Chat[]>;
    GetMessageID(id: string): Promise<Chat>;
    FindTwoChat(id: string, id2: string): Promise<Chat>;
    getHistory(chat: Chat): Promise<{
        login: string;
        message: string;
    }[]>;
    createChat(user: User): Promise<Chat>;
    addParticipant(chat: Chat, user: User): Promise<Chat>;
}
