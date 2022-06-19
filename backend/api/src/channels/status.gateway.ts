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
import { MatchsService } from "../matchs/matchs.service";
import { Matchs } from "../matchs/matchs.entity";

@WebSocketGateway()
export class StatusGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly matchSevice: MatchsService
  ) {}

  @WebSocketServer() server: any;
  private logger: Logger = new Logger("StatusGateway");

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  @SubscribeMessage("notification")
  async SendMessageToChannel(client: Socket, message: any): Promise<void> {
    try {
      const user: User = client.data.user;
      if (message[0] === "invite") {
        console.log("OKK");
        if (message[1]) {
          const invited = await this.userService.getUserId(message[1]);
          const match = await this.matchSevice.createMatch(invited.id);
          this.matchSevice.addPlayerToMatch(client.data.user, match);
          console.log(message);
          this.emitNotif(
            client.data,
            "notification",
            invited.user_name,
            "game",
            match.id,
            user.user_name
          );
        }
      }
      if (message[0] === "join") {
        const gameID = message[1];
        const match = await this.matchSevice.getMatchsId(gameID, [
          { withUsers: true },
        ]);
        this.emitNotif(
          client.data,
          "notification",
          match.SecondPlayer.user_name,
          "join",
          gameID
        );
      }
      if (message[0] === "deny") {
        const gameID = message[1];
        this.matchSevice.deleteMatch(gameID);
      }
      if (message[0] === "create") this.emitNotif(client.data, "notification", "update");
    } catch {}
  }

  emitNotif(client: any, event: string, ...args: any): void {
    try {
      const sockets: any[] = Array.from(this.server.sockets.sockets.values());
      sockets.forEach((socket) => {
        socket.emit(event, ...args);
      });
    } catch {}
  }

  async handleDisconnect(client: Socket) {
    if (client.data.user) {
      const user = await this.userService.getUserId(client.data.user.id);
      user.status = UserStatus.OFFLINE;
      this.emitNotif(
        client.data,
        "notification",
        client.data.user.id,
        "disconnect"
      );
      this.userService.saveUser(user);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  isStatus(client: Socket, user: User) {
    user.status = UserStatus.ONLINE;
    this.userService.saveUser(user);
    this.emitNotif(client.data, "notification", client.data.user.id, "connect");
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
