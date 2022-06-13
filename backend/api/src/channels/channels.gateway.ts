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
      this.emitChannel(client.data, "Hello");
      client.emit('Hello', message);
    } catch {}
  }

  emitChannel(socket: any, event: string, ...args: any): void {
    try {
      console.log("aa");
      if (!socket.user) return;
      console.log(this.server.sockets);
      const sockets: any[] = Array.from(this.server.sockets.value());
      console.log(sockets);
      sockets.forEach((socket) => {
        if (socket.users.find((user) => user.data.channel == socket.data.channel))
          socket.emit(event, ...args);
      });
    } catch {}
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const user = await this.authService.getUserFromSocket(client);

      const allchan = await this.channelService.getChannel();
      client.data.user = user;
      client.data.ConnectedChannel = client.handshake.headers.channel;
      if (!client.data.ConnectedChannel)
        throw new UnauthorizedException("You must specify a channel");
      client.emit("info", { user, allchan });
      this.logger.log(`Client connected: ${client.id}`);
    } catch (err) {
      return client.disconnect();
    }
  }
}
