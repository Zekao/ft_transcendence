import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { AuthService } from "src/auth/auth.services";
import { ChannelsService } from "./channels.service";
import { User } from "../users/users.entity";
export declare class StatusGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly userService;
    private readonly authService;
    private readonly channelService;
    constructor(jwtService: JwtService, userService: UsersService, authService: AuthService, channelService: ChannelsService);
    server: any;
    private logger;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): Promise<void>;
    isStatus(client: Socket, user: User): boolean;
    handleConnection(client: Socket, ...args: any[]): Promise<Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
}
