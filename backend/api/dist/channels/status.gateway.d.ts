import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { UsersService } from "../users/users.service";
import { AuthService } from "src/auth/auth.services";
import { User } from "../users/users.entity";
import { MatchsService } from "../matchs/matchs.service";
export declare class StatusGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly userService;
    private readonly authService;
    private readonly matchSevice;
    constructor(userService: UsersService, authService: AuthService, matchSevice: MatchsService);
    server: any;
    private logger;
    afterInit(server: Server): void;
    SendMessageToChannel(client: Socket, message: any): Promise<void>;
    emitNotif(client: any, event: string, ...args: any): void;
    handleDisconnect(client: Socket): Promise<void>;
    isStatus(client: Socket, user: User): boolean;
    handleConnection(client: Socket, ...args: any[]): Promise<Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
}
