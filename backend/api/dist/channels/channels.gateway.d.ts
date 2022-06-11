import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { AuthService } from "src/auth/auth.services";
export declare class ChannelsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly userService;
    private readonly authService;
    constructor(jwtService: JwtService, userService: UsersService, authService: AuthService);
    server: Server;
    private logger;
    afterInit(server: Server): void;
    joinChannel(participant: string, client: Socket): void;
    handleMessage(client: Socket, message: string): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): Promise<Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
}
