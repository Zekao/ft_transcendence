import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { AuthService } from "src/auth/auth.services";
import { ChannelsService } from "./channels.service";

@WebSocketGateway()
export class ChannelsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly channelService: ChannelsService
  ) {}

  @WebSocketServer() server: any;
  private logger: Logger = new Logger("ChannelsGateway");

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  @SubscribeMessage("channel") // Return connected user to channel
  async getChannel(client: Socket, id: string): Promise<void> {
    try {
      const channel = await this.channelService.getChannelId(id);
      console.log("fddf");
      client.emit("channel", channel);
    } catch {}
  }

  @SubscribeMessage("MyChannel")
  async getChannelMe(client: Socket): Promise<void> {
    try {
      client.emit('MyChannel', "chann info");
    } catch {}
  }

  emitChannel(channel: any, event: string, ...args: any): void {
    try {
      if (!channel.users) return;

      const sockets: any[] = Array.from(this.server.sockets.values());
      sockets.forEach((socket) => {
        if (channel.users.find((user) => user.id == socket.data.user.id))
          socket.emit(event, ...args);
      });
    } catch {}
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const user = await this.authService.getUserIDFromSocket(client);

      const allchan = await this.channelService.getChannel();
      client.data.user = user;
      client.emit("info", { user, allchan });
      this.logger.log(`Client connected: ${client.id}`);
    } catch (err) {
      return client.disconnect();
    }
  }
}
