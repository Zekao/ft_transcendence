import { AuthenticationService } from "../authentication/authentication.service";
import { Socket } from "socket.io";
import Message from "../message/message.entity";
import { User } from "../users/users.entity";
import { Repository } from "typeorm";
export declare class ChatService {
    private readonly authenticationService;
    private messagesRepository;
    constructor(authenticationService: AuthenticationService, messagesRepository: Repository<Message>);
    getUserFromSocket(socket: Socket): Promise<User>;
    saveMessage(content: string, author: User): Promise<Message>;
    getAllMessages(): Promise<Message[]>;
}
