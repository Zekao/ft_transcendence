import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { UsersService } from "../users/users.service";
import { AuthService } from "src/auth/auth.services";
import { ChannelsService } from "./channels.service";
import { Channel } from "./channels.entity";
export declare class ChannelsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly userService;
    private readonly authService;
    private readonly channelService;
    constructor(userService: UsersService, authService: AuthService, channelService: ChannelsService);
    server: any;
    private logger;
    afterInit(server: Server): void;
    addToHistory(channel: Channel, id: string, message: string): Promise<void>;
    addMuteTime(channel: Channel, id: string, time: number): Promise<void>;
    CanTalk(channel: Channel, id: string, time: number): Promise<boolean>;
    removeMuteTime(channel: Channel, id: string): Promise<void>;
    mutePlayer(client: Socket, message: any): Promise<void>;
    unmutePlayer(client: Socket, message: any): Promise<void>;
    banPlayer(client: Socket, message: any): Promise<void>;
    unbanPlayer(client: Socket, message: any): Promise<void>;
    adminPlayer(client: Socket, message: any): Promise<void>;
    unadminPlayer(client: Socket, message: any): Promise<void>;
    deletePlayerMember(client: Socket): Promise<void>;
    SendMessageToChannel(client: Socket, message: any): Promise<void>;
    emitChannel(channel: any, event: string, ...args: any): Promise<void>;
    emitSingle(channel: any, event: string, ...args: any): void;
    handleDisconnect(client: Socket): void;
    createOrAddUserToChannel(client: Socket): Promise<void>;
    isChannel(client: Socket): Promise<boolean>;
    handleConnection(client: Socket, ...args: any[]): Promise<Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
}
