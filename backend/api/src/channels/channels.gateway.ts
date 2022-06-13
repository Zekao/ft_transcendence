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

  @SubscribeMessage("channel") // Connect user to the channel
  async connectToSocket(client: Socket, msg: string): Promise<void> {
    try {
      const message = client.data.user.user_name + ": " + msg;
      console.log(client.data.ConnectedChannel);
      this.emitChannel(client.data, "Hello", message);
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

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const user = await this.authService.getUserFromSocket(client);
      const allchanel = await this.channelService.getChannel();
      client.data.user = user;
      if (client.data.status) {
        user.status = UserStatus.ONLINE;
        this.userService.saveUser(user);
        return ;
      }
      client.data.ConnectedChannel = client.handshake.headers.channel;
      if (!client.data.ConnectedChannel)
        throw new UnauthorizedException("You must specify a channel");
      client.emit("info", { user, allchanel });
      this.logger.log(`Client connected: ${client.id}`);
    } catch (err) {
      return client.disconnect();
    }
  }
}
