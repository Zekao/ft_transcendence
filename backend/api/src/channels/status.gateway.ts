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

@WebSocketGateway()
export class StatusGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly channelService: ChannelsService
  ) {}

  @WebSocketServer() server: any;
  private logger: Logger = new Logger("StatusGateway");

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  @SubscribeMessage("notification")
  async SendMessageToChannel(client: Socket, message: any): Promise<void> {
    try {
      const user: string = client.data.user;
      if (message[0] === "invite") {
        console.log(message);
        if (message[1]) {
          const invited = this.userService.getUserId(message[1]);
          this.emitChannel(invited, "notification", "GAME", "GAME-ID", "USER");
        }
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
    const user = client.data.user;
    user.status = UserStatus.OFFLINE;
    this.userService.saveUser(user);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  isStatus(client: Socket, user: User) {
    user.status = UserStatus.ONLINE;
    this.userService.saveUser(user);
    this.logger.log(`Client connected: ${client.id}`);
    return true;
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const user = await this.authService.getUserFromSocket(client);
      client.data.user = user;
      if (this.isStatus(client, user)) return;
    } catch (err) {
      return client.disconnect();
    }
  }
}
