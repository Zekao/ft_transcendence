import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { AuthService } from "src/auth/auth.services";
import { ChannelsService } from "./channels.service";
export declare class ChannelsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly userService;
    private readonly authService;
    private readonly channelService;
    constructor(jwtService: JwtService, userService: UsersService, authService: AuthService, channelService: ChannelsService);
    server: any;
    private logger;
    afterInit(server: Server): void;
    connectToSocket(client: Socket, msg: string): Promise<void>;
    emitChannel(socket: any, event: string, ...args: any): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): Promise<Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
}
