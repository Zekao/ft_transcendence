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

  @SubscribeMessage("channel")
  async SendMessageToChannel(client: Socket, msg: string): Promise<void> {
    try {
      const channel = client.data.ConnectedChannel;
      const message = client.data.user.user_name + ": " + msg;
      this.emitChannel(client.data, channel, message);
    } catch {}
  }

  @SubscribeMessage("msg")
  async SendPrivateMessage(client: Socket, msg: string): Promise<void> {
    try {
      const receiver = client.data.msg;
      const message = client.data.user.user_name + ": " + msg;
      this.emitChannel(client.data, receiver, message);
    } catch {}
  }

  emitChannel(channel: any, event: string, ...args: any): void {
    try {
      if (!channel.user) return;
      const sockets: any[] = Array.from(this.server.sockets.sockets.values());
      sockets.forEach((socket) => {
        if (channel.ConnectedChannel == socket.data.ConnectedChannel)
          socket.emit(event, ...args);
      });
    } catch {}
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    console.log(user);
    if (client.data.status)
    {
      user.status = UserStatus.OFFLINE;
      this.userService.saveUser(user);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  isStatus(client: Socket, user: User) {
    client.data.status = client.handshake.headers.status
    if (client.data.status) {
      user.status = UserStatus.ONLINE;
      this.userService.saveUser(user);
      this.logger.log(`Client connected: ${client.id}`);
      return true;
    }
    return false;
  }

  isMsg(client: Socket) {
    client.data.msg = client.handshake.headers.msg
    if (client.data.msg) {
      this.logger.log(`Client connected: ${client.id}`);
      return true;
    }
    return false;
  }

  isChannel(client: Socket) {
    client.data.ConnectedChannel = client.handshake.headers.channel;
    if (client.data.ConnectedChannel) {
      this.logger.log(`Client connected: ${client.id}`);
      return true;
    }
    return false;
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const user = await this.authService.getUserFromSocket(client);
      const allchanel = await this.channelService.getChannel();
      client.data.user = user;
      if (this.isStatus(client, user))
        return ;
      if (this.isMsg(client))
        return ;
      if (this.isChannel(client))
        return ;
      throw new UnauthorizedException("You must specify a channel, or msg");
    } catch (err) {
      return client.disconnect();
    }
  }
}
