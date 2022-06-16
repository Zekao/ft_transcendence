import { UsersService } from "../users/users.service";
import { ChatService } from "./chat.service";
export declare class ChatController {
    private chatService;
    private usersService;
    constructor(chatService: ChatService, usersService: UsersService);
    GetHistoryMessage(id: string, req: any): Promise<{
        login: string;
        message: string;
    }[]>;
}
