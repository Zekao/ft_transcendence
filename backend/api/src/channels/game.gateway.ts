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
    } else if (message == "ADD P1") {
      await this.matchService.addOnePointToPlayer(match, "ONE");
      this.emitGame(client.data, "action", "RESET");
    } else if (message == "ADD P2") {
      await this.matchService.addOnePointToPlayer(match, "TWO");
      this.emitGame(client.data, "action", "RESET");
    }
  }

  async updateBall(client: Socket): Promise<void> {
    let direction = client.data.direction;
    let ball = client.data.posBall;
    let velocity = client.data.velocity;
    const match: Matchs = client.data.match;
    const pOne = client.data.posPlayer.pOne;
    const pTwo = client.data.posPlayer.pTwo;

    if (!ball.x || !ball.y) ball = { x: 420, y: 400 };

    if (match.scoreFirstPlayer >= 5 || match.scoreSecondPlayer >= 5) {
      this.emitGame(client.data, "action", "FINISH");
      return;
    }
    if (direction.x === 1 || direction.x === -1) {
      while (direction.x <= 0.2 || direction.x >= 0.9) {
        if (match.scoreFirstPlayer >= match.scoreSecondPlayer)
          direction = { x: 0.45312, y: 0.6291837 };
        else direction = { x: -0.45312, y: -0.6291837 };
      }
    }
    const deltaTime = 300;
    ball.x += direction.x * velocity * deltaTime;
    ball.y += direction.y * velocity * deltaTime;
    //EMIT FUNCTION 2
    this.saveAllData(client, direction, velocity, ball);
    this.collisionDetect(client);
    if (ball.x <= 0) {
      if (match.scoreSecondPlayer >= 5) {
        this.emitGame(client.data, "action", "FINISH"); // EMIT FINISH GAME
      } else {
        velocity = 0.00005;
        this.matchService.addOnePointToPlayer(match, "TWO"); // EMIT TO ADD POINT IN FRONT
        this.resetBall(client);
      }
    } else if (ball.x >= 850) {
      if (match.scoreFirstPlayer >= 5) {
        this.emitGame(client.data, "action", "FINISH"); // EMIT FINISH GAME
      } else {
        velocity = 0.00005;
        this.matchService.addOnePointToPlayer(match, "ONE"); // EMIT TO ADD POINT IN FRONT
        this.resetBall(client);
      }
    }
    if (ball.x < 0 || ball.x > 850) {
      direction.x = -direction.x;
    }
    if (ball.y < 0 || ball.y > 720) {
      direction.y = -direction.y;
    }
    if (
      ball.x >= pOne.x &&
      ball.x <= pOne.x + 20 &&
      ball.y >= pOne.y &&
      ball.y <= pOne.y + 120
    ) {
      direction.x = -direction.x;
    }
    if (
      ball.x >= pTwo.x &&
      ball.x <= pTwo.x + 20 &&
      ball.y >= pTwo.y &&
      ball.y <= pTwo.y + 120
    ) {
      direction.x = -direction.x;
    }
    if (velocity < 0.05) velocity += 0.00005;
    velocity += 0.00005;
  }

  saveAllData(
    client: Socket,
    direction: number,
    velocity: number,
    ball: { x: number; y: number }
  ) {
    if (direction) client.data.direction = direction;
    if (velocity) client.data.velocity = velocity;
    if (ball) client.data.ball = ball;
  }

  collisionDetect(client: Socket) {
    const direction = client.data.direction;
    const ball = client.data.posBall;
    const pOne = client.data.posPlayer.pOne;
    const pTwo = client.data.posPlayer.pTwo;

    if (
      ball.x + ball.radius >= pOne.x &&
      ball.x - ball.radius <= pOne.x + 20 &&
      ball.y + ball.radius >= pOne.y &&
      ball.y - ball.radius <= pOne.y + 120
    ) {
      ball.x += 4;
      direction.x = -direction.x;
    } else if (
      ball.x + ball.radius >= pTwo.x &&
      ball.x - ball.radius <= pTwo.x + 20 &&
      ball.y + ball.radius >= pTwo.y &&
      ball.y - ball.radius <= pTwo.y + 120
    ) {
      ball.x -= 4;
      direction.x = -direction.x;
    }
    this.saveAllData(client, direction, null, ball);
  }

  resetBall(client: Socket) {
    let direction = client.data.direction;
    const ball = client.data.posBall;
    const match: Matchs = client.data.match;

    ball.x = 420;
    ball.y = 400;
    direction = { x: 0 } as { x: number; y: number };
    while (Math.abs(direction.x) <= 0.2 || Math.abs(direction.x) >= 0.9) {
      if (match.scoreFirstPlayer >= match.scoreSecondPlayer)
        direction = { x: 0.45312, y: 0.6291837 };
      else direction = { x: -0.45312, y: -0.6291837 };
    }
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
        this.emitGame(client.data, "move", pOne, 1);
      } else {
        if (message === "up" && pTwo >= 0) pTwo -= 13;
        else if (message === "down" && pTwo <= 580) pTwo += 13;
        this.emitGame(client.data, "move", pTwo, 2);
      }
      client.data.posPlayer.pOne = pOne;
      client.data.posPlayer.pTwo = pTwo;
    } catch {}
  }

  emitReset(client: Socket) {
    this.emitGame(client.data, "reset");
  }

  emitAdd1(client: Socket) {
    this.emitGame(client.data, "add1");
  }


  emitAdd2(client: Socket) {
    this.emitGame(client.data, "add2");
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
    client.data.posBall = { x: 420, y: 400, rad: 10 };
    client.data.direction = { x: 1, y: 1 };
    client.data.velocity = 0.00005;
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
