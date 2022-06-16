import { Chat } from "./chat.entity";
import { ChatService } from "./chat.service";
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    GetMessage(): Promise<Chat[]>;
    GetHistoryMessage(id: string): Promise<Chat>;
    CreateNewChat(req: any): Promise<Chat>;
}
