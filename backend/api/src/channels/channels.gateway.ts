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
import { Logger, UnauthorizedException } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { AuthService } from "src/auth/auth.services";
import { ChannelsService } from "./channels.service";
import { UserStatus } from "../users/users.enum";
import { User } from "../users/users.entity";
import { Channel } from "./channels.entity";

@WebSocketGateway({ namespace: "channel" })
export class ChannelsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly channelService: ChannelsService
  ) {}

  @WebSocketServer() server: any;
  private logger: Logger = new Logger("ChannelsGateway");

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  @SubscribeMessage("channel")
  async SendMessageToChannel(client: Socket, message: any): Promise<void> {
    try {
      const channel: Channel = client.data.channel;
      const login: string = client.data.user.display_name;
      if (message[0] === "msg") {
        if (!channel.history) channel.history = [];
        const history = { login, message: message[1] };
        channel.history.push(history);
        this.channelService.saveChannel(channel);
        this.emitChannel(client.data, "channel", login, message[1]);
      } else if (message[0] == "action") {
        if (message[1] == "logout")
          client.disconnect();
      }
    } catch {}
  }

  emitChannel(channel: any, event: string, ...args: any): void {
    try {
      if (!channel.user) return;
      const sockets: any[] = Array.from(this.server.sockets.values());
      sockets.forEach((socket) => {
        if (channel.ConnectedChannel == socket.data.ConnectedChannel)
          socket.emit(event, ...args);
      });
    } catch {}
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async isChannel(client: Socket) {
    client.data.ConnectedChannel = client.handshake.auth.channel;
    client.data.password = client.handshake.auth.password;
    if (client.data.ConnectedChannel && client.data.password) {
        client.data.channel = await this.channelService.getChannelId(
        client.data.ConnectedChannel, client.data.password
      );
      if (client.data.channel == false) return false;
      else {
        this.logger.log(`Client connected: ${client.id}`);
        return true;
      }
    }
    return false;
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const user = await this.authService.getUserFromSocket(client);
      client.data.user = user;
      if (await this.isChannel(client)) return;
      throw new UnauthorizedException("You must specify a channel, or msg");
    } catch (err) {
      return client.disconnect();
    }
  }
}
