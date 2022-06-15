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
import { UsersService } from "../users/users.service";
import { AuthService } from "src/auth/auth.services";
import { ChannelsService } from "./channels.service";
import { UserGameStatus, UserStatus } from "../users/users.enum";
import { User } from "../users/users.entity";
import { Channel } from "./channels.entity";
import { MatchsService } from "../matchs/matchs.service";
import { Matchs } from "../matchs/matchs.entity";

@WebSocketGateway({ namespace: "game" })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly matchService: MatchsService,
    private readonly userService: UsersService,
    private readonly authService: AuthService
  ) {}

  @WebSocketServer() server: any;
  private logger: Logger = new Logger("GameGateway");

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  @SubscribeMessage("action")
  async waitingList(client: Socket, message: string): Promise<void> {
    try {
      const player = client.data.user;
      const match: Matchs = client.data.match;
      if (message[0] == "action") {
        if (message[1] == "join") {
          console.log("JOIN");
        }
        if (message[1] == "leave") {
          console.log("LEAVE");
        }
      }
      this.emitChannel(client.data, "waitinglist", "READY");
    } catch {}
  }

  @SubscribeMessage("move")
  async gamecontrol(client: Socket, message: string): Promise<void> {
    try {
      const player = client.data.user;
      const match: Matchs = client.data.match;
      // console.log(message);
      // console.log(match);
      console.log("FIRST PLAYER INFORMATIONS:", match.FirstPlayer);
      if (player == match.FirstPlayer) console.log("FIRST");
      else if (player == match.SecondPlayer) console.log("SECOND");
      const pos1 = await this.matchService.getPosFirstPlayer(match);
      const pos2 = await this.matchService.getPosSecondPlayer(match);
      console.log(pos1);
      console.log(pos2);
      if (message == "up") {
        await this.matchService.setPosFirstPlayer(match, pos1 - 5);
        this.emitChannel(client.data, match.id, pos1, pos2);
      }
      if (message == "down")
        await this.matchService.setPosFirstPlayer(match, pos1 + 5);
      this.emitChannel(client.data, "move", pos1);
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
    const waiting = client.data.waiting;
    const user = client.data.user;
    if (user || waiting) {
      user.in_game = UserGameStatus.OUT_GAME;
      this.userService.saveUser(user);
    }
    console.log("OUT GAME");
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async isWaitinglist(client: Socket, user: User) {
    client.data.waitinglist = client.handshake.auth.waitinglist;
    if (client.data.waitinglist) {
      console.log("IN_WAITINGLIST");
      this.logger.log(`Client connected: ${client.id}`);
      return true;
    }
    return false;
  }

  async isInGame(client: Socket, user: User) {
    client.data.game = client.handshake.auth.game;
    if (client.data.game) {
      user.in_game = UserGameStatus.IN_GAME;
      this.userService.saveUser(user);
      console.log("IN_GAME");
      this.logger.log(`Client connected: ${client.id}`);
      return true;
    }
    return false;
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const user = await this.authService.getUserFromSocket(client);
      if (this.isWaitinglist(client, user)) return;
      const match = await this.matchService.getMatchsId(
        client.handshake.auth.game,
        [{ withUsers: true }]
      );
      client.data.user = user;
      client.data.match = match;
      if (this.isInGame(client, user)) return;
      throw new UnauthorizedException("You must be in a game");
    } catch (err) {
      return client.disconnect();
    }
  }
}
