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

  @SubscribeMessage("action")
  async waitingList(client: Socket, message: string): Promise<void> {
    try {
      const player: User = client.data.user;
      if (message === "join") {
        const findedMatch = await this.matchService.defineMatch(
          client.data.user
        );
        if (findedMatch.id) {
          client.data.match = findedMatch;
          console.log("FIND A MATCH");
          this.emitReady(client.data, "wait", "ready", findedMatch.id);
        } else {
          console.log("CREATION OF THE MATCH");
          const match = await this.matchService.createMatch(player.id);
          client.data.match = match;
        }
      }
      if (message === "leave") {
        if (client.data.match)
          await this.matchService.deleteMatch(client.data.match.id);
        client.data.match = null;
        console.log("LEAVE THE WAITING LIST MATCH");
      }
    } catch {}
  }

  emitReady(player: any, event: string, ...args: any): void {
    try {
      if (!player.user) return;
      const sockets: any[] = Array.from(this.server.sockets.values());
      sockets.forEach((socket) => {
        if (player.game == socket.data.game)
          socket.emit(event, socket.data.user.user_name, ...args);
      });
    } catch {}
  }

  @SubscribeMessage("action")
  async GameAction(client: Socket, message: string): Promise<void> {
    const match: Matchs = client.data.match;

    if (message == "FINISH") {
      console.log("GAME IS FINISH");
      match.status = MatchStatus.ENDED;
      this.matchService.saveMatch(match);
      client.data.match = null;
      client.disconnect();
    } else if (message == "ADD P1")
      await this.matchService.addOnePointToPlayer(match, "ONE");
    else if (message == "ADD P2")
      await this.matchService.addOnePointToPlayer(match, "TWO");
  }

  @SubscribeMessage("move")
  async gamecontrol(client: Socket, message: string): Promise<void> {
    try {
      let pOne = client.data.posPlayer.pOne;
      let pTwo = client.data.posPlayer.pTwo;
      const player = client.data.user;
      const match: Matchs = client.data.match;
      if (player.user_name == match.FirstPlayer.user_name) {
        if (message === "up" && pOne >= 0) pOne -= 13;
        else if (message === "down" && pOne <= 580) pOne += 13;
        console.log("PosOne: ", pOne);
        this.emitGame(client.data, "move", pOne, 1);
      } else {
        if (message === "up" && pTwo >= 0) pTwo -= 13;
        else if (message === "down" && pTwo <= 580) pTwo += 13;
        console.log("PosTwo: ", pTwo);
        this.emitGame(client.data, "move", pTwo, 2);
      }
      client.data.posPlayer.pOne = pOne;
      client.data.posPlayer.pTwo = pTwo;
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
    try {
      if (client.data.match && client.data.match.status === MatchStatus.PENDING)
        await this.matchService.deleteMatch(client.data.match.id);
      if (user || waiting) {
        user.in_game = UserGameStatus.OUT_GAME;
        this.userService.saveUser(user);
      }
    } catch (err) {}
    console.log("OUT GAME");
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async isWaitinglist(client: Socket, user: User) {
    client.data.waitinglist = client.handshake.auth.waitinglist;
    if (client.data.waitinglist) {
      console.log("CONNECTED TO SOCKET GAME");
      this.logger.log(`Client connected: ${client.id}`);
      return true;
    }
    return false;
  }

  async isInGame(client: Socket, user: User) {
    const match: Matchs = await this.matchService.getMatchsId(
      client.handshake.auth.game,
      [{ withUsers: true }]
    );
    client.data.match = match;
    client.data.game = client.handshake.auth.game;
    client.data.posPlayer = { pOne: 250, pTwo: 250 };
    // client.data.posBall = { pX: 420, pY: 400, rad: 10 };
    // client.data.direction = { x: 1, y: 1 };
    // client.data.velocity = 0.00005;
    if (client.data.game) {
      user.in_game = UserGameStatus.IN_GAME;
      this.userService.saveUser(user);
      console.log("CONNECTED TO THE PONG GAME");
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
      if (this.isInGame(client, user)) return;
      throw new UnauthorizedException("You must be in a game");
    } catch (err) {
      return client.disconnect();
    }
  }
}
