import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { UsersService } from "../users/users.service";
import { AuthService } from "src/auth/auth.services";
import { User } from "../users/users.entity";
import { MatchsService } from "../matchs/matchs.service";
export declare class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly matchService;
    private readonly userService;
    private readonly authService;
    constructor(matchService: MatchsService, userService: UsersService, authService: AuthService);
    server: any;
    private logger;
    afterInit(server: Server): void;
    resetball(client: Socket, message: string): Promise<void>;
    waitingList(client: Socket, message: string): Promise<void>;
    gamecontrol(client: Socket, message: string): Promise<void>;
    emitOnlyToOther(player: any, event: string, ...args: any): void;
    emitGame(player: any, event: string, ...args: any): void;
    handleDisconnect(client: Socket): Promise<void>;
    isWaitinglist(client: Socket, user: User): Promise<boolean>;
    isInGame(client: Socket, user: User): Promise<boolean>;
    handleConnection(client: Socket, ...args: any[]): Promise<Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
}
