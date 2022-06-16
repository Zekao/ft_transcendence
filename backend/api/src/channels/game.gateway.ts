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
import { MatchStatus } from "../matchs/matchs.enum";

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

  @SubscribeMessage("reset")
  async resetball(client: Socket, message: string): Promise<void> {
    try {
      this.emitOnlyToOther(client.data, "reset");
    } catch {}
  }

  @SubscribeMessage("action")
  async waitingList(client: Socket, message: string): Promise<void> {
    try {
      const player: User = client.data.user;
      if (message == "join") {
        const findedMatch = await this.matchService.defineMatch(
          client.data.user
        );
        if (findedMatch.id) {
          this.server.emit("wait", "ready", findedMatch.id);
          // this.emitGame(client.data, "waitinglist", "ready", findedMatch.id);
        } else {
          const match = await this.matchService.createMatch(player.id);
          client.data.match = match;
        }
        console.log("JOIN");
      }
      if (message == "leave") {
        if (client.data.match)
          await this.matchService.deleteMatch(client.data.match.id);
        client.data.match = null;
        console.log("LEAVE");
      }
    } catch {}
  }

  @SubscribeMessage("move")
  async gamecontrol(client: Socket, message: string): Promise<void> {
    try {
      const player = client.data.user;
      const match: Matchs = client.data.match;
      console.log("============ DEBUG ============");
      console.log(" first player :", match.FirstPlayer.user_name);
      console.log("============ PLAYING ============");
      console.log(player.user_name);
      console.log("============ WHO ============");
      if (player.user_name == match.FirstPlayer.user_name) console.log("FIRST");
      let pos1 = await this.matchService.getPosFirstPlayer(match);
      let pos2 = await this.matchService.getPosSecondPlayer(match);
      if (pos1 == 0) pos1 = 25;
      if (pos2 == 0) pos2 = 25;
      console.log(pos1);
      console.log(pos2);
      if (player.user_name == match.FirstPlayer.user_name) {
        if (message == "up") {
          await this.matchService.setPosFirstPlayer(match, pos1 - 13);
        }
        if (message == "down")
          await this.matchService.setPosFirstPlayer(match, pos1 + 13);
        this.emitGame(client.data, "move", pos1, pos2);
      } else {
        if (message == "up") {
          await this.matchService.setPosSecondPlayer(match, pos2 - 13);
        }
        if (message == "down") {
          await this.matchService.setPosSecondPlayer(match, pos2 + 13);
        }
        this.emitGame(client.data, "move", pos1, pos2);
      }
    } catch {}
  }

  emitOnlyToOther(player: any, event: string, ...args: any): void {
    try {
      if (!player.user) return;
      const sockets: any[] = Array.from(this.server.sockets.values());
      sockets.forEach((socket) => {
        if (player.game == socket.data.game && player.user != socket.data.user)
          socket.emit(event, ...args);
      });
    } catch {}
  }

  emitGame(player: any, event: string, ...args: any): void {
    try {
      if (!player.user) return;
      const sockets: any[] = Array.from(this.server.sockets.values());
      sockets.forEach((socket) => {
        if (player.game == socket.data.game) socket.emit(event, ...args);
      });
    } catch {}
  }

  async handleDisconnect(client: Socket) {
    const waiting = client.data.waiting;
    const user = client.data.user;
    if (client.data.match && client.data.match.status === MatchStatus.PENDING)
      await this.matchService.deleteMatch(client.data.match.id);
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
      client.data.user = user;
      if ((await this.isWaitinglist(client, user)) != false) return;
      const match = await this.matchService.getMatchsId(
        client.handshake.auth.game,
        [{ withUsers: true }]
      );
      client.data.match = match;
      if (this.isInGame(client, user)) return;
      throw new UnauthorizedException("You must be in a game");
    } catch (err) {
      return client.disconnect();
    }
  }
}
