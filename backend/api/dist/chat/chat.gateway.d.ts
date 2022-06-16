import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { AuthService } from "src/auth/auth.services";
import { ChatService } from "./chat.service";
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    private readonly chatService;
    constructor(authService: AuthService, chatService: ChatService);
    server: any;
    private logger;
    afterInit(server: Server): void;
    SendPrivateMessage(client: Socket, msg: string): Promise<void>;
    emitChannel(channel: any, event: string, ...args: any): void;
    handleDisconnect(client: Socket): void;
    isMsg(client: Socket): boolean;
    handleConnection(client: Socket, ...args: any[]): Promise<Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
}
