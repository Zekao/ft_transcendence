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
        const findedMatch = await this.matchService.defineMatch(player);

        if (findedMatch != null && findedMatch.id) {
          client.data.match = this.matchService.getMatchsId(findedMatch.id, [
            { withUsers: true },
          ]);
          this.emitReady(
            client.data,
            "wait",
            findedMatch.FirstPlayer.user_name,
            findedMatch.SecondPlayer.user_name,
            "ready",
            findedMatch.id
          );
        } else {
          const match = await this.matchService.createMatch(player.id);
          client.data.match = await this.matchService.getMatchsId(match.id, [
            { withUsers: true },
          ]);
        }
      }
      if (message === "leave") {
        if (client.data.match)
          await this.matchService.deleteMatch(client.data.match.id);
        client.data.match = null;
      }
    } catch {}
  }

  emitReady(player: any, event: string, ...args: any): void {
    try {
      if (!player.user) return;
      const sockets: any[] = Array.from(this.server.sockets.values());
      sockets.forEach((socket) => {
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

  @SubscribeMessage("gameAction")
  async GameAction(client: Socket, message: string): Promise<void> {
    const match: Matchs = client.data.match;
    const user = client.data.user;

    if (match === null) {
      client.disconnect();
      return;
    }
    if (
      message == "updateBall" &&
      user.user_name === match.FirstPlayer.user_name
    )
      this.updateBall(client);
  }

  async updateBall(client: Socket): Promise<void> {
    let direction = client.data.direction;
    let ball = client.data.posBall;
    let velocity = client.data.velocity;
    const match: Matchs = client.data.match;
    const pOne = client.data.posPlayerOne;
    const pTwo = client.data.posPlayerTwo;

    if (match.scoreFirstPlayer >= 5 || match.scoreSecondPlayer >= 5) {
      this.finishGame(client);
      return;
    }
    if (direction.x === 1 || direction.x === -1) {
      while (direction.x <= 0.2 || direction.x >= 0.9) {
        const heading = this.randomNumberBetween(0, 2 * Math.PI);
        direction = { x: Math.cos(heading), y: Math.sin(heading) };
      }
    }
    const deltaTime = 300;
    ball.x += direction.x * velocity * deltaTime;
    ball.y += direction.y * velocity * deltaTime;
    this.saveAllData(client, direction, velocity, ball);
    this.emitGame(
      client.data,
      "gameAction",
      match.id,
      "moveBall",
      ball.x,
      ball.y
    );
    this.collisionDetect(client);
    ball = client.data.posBall;
    direction = client.data.direction;
    if (ball.x <= 0) {
      if (match.scoreSecondPlayer >= 5) {
        this.finishGame(client);
      } else {
        velocity = 0.00005;
        this.matchService.addOnePointToPlayer(match, "TWO");
        this.emitGame(client.data, "gameAction", match.id, "addTwo");
        this.resetBall(client);
      }
    } else if (ball.x >= 850) {
      if (match.scoreFirstPlayer >= 5) {
        this.finishGame(client);
      } else {
        velocity = 0.00005;
        this.matchService.addOnePointToPlayer(match, "ONE");
        this.emitGame(client.data, "gameAction", match.id, "addOne");
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
    this.saveAllData(client, direction, velocity, ball);
  }

  saveAllData(
    client: Socket,
    direction: { x: number; y: number },
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
    const pOne = client.data.posPlayerOne;
    const pTwo = client.data.posPlayerTwo;

    if (
      ball.x + ball.rad >= pOne.x &&
      ball.x - ball.rad <= pOne.x + 20 &&
      ball.y + ball.rad >= pOne.y &&
      ball.y - ball.rad <= pOne.y + 120
    ) {
      ball.x += 4;
      direction.x = -direction.x;
    } else if (
      ball.x + ball.rad >= pTwo.x &&
      ball.x - ball.rad <= pTwo.x + 20 &&
      ball.y + ball.rad >= pTwo.y &&
      ball.y - ball.rad <= pTwo.y + 120
    ) {
      ball.x -= 4;
      direction.x = -direction.x;
    }
    this.saveAllData(client, direction, null, ball);
  }

  async finishGame(client: Socket) {
    const match: Matchs = client.data.match;

    if (match) {
      if (match.scoreFirstPlayer > match.scoreSecondPlayer) {
        this.userService.addWinLoose(
          match.FirstPlayer.id,
          match.SecondPlayer.id,
          "PLAYER1"
        );
      } else if (match.scoreSecondPlayer > match.scoreFirstPlayer) {
        this.userService.addWinLoose(
          match.FirstPlayer.id,
          match.SecondPlayer.id,
          "PLAYER2"
        );
      }
      match.status = MatchStatus.ENDED;
      this.matchService.saveMatch(match);
      this.emitGame(client.data, "gameAction", match.id, "FINISH");
    }
  }

  randomNumberBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  resetBall(client: Socket) {
    let direction = client.data.direction;
    const ball = client.data.posBall;

    ball.x = 420;
    ball.y = 400;
    direction = { x: 0 } as { x: number; y: number };
    while (Math.abs(direction.x) <= 0.2 || Math.abs(direction.x) >= 0.9) {
      const heading = this.randomNumberBetween(0, 2 * Math.PI);
      direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
    this.saveAllData(client, direction, null, ball);
  }

  @SubscribeMessage("move")
  async gamecontrol(client: Socket, message: string): Promise<void> {
    try {
      const pOne = client.data.posPlayerOne;
      const pTwo = client.data.posPlayerTwo;
      const player = client.data.user;
      const match: Matchs = client.data.match;
      if (player.user_name == match.FirstPlayer.user_name) {
        if (message === "up" && pOne.y >= 0) pOne.y -= 13;
        else if (message === "down" && pOne.y <= 580) pOne.y += 13;
        this.emitGame(client.data, "move", match.id, pOne.y, 1);
      } else if (player.user_name == match.SecondPlayer.user_name) {
        if (message === "up" && pTwo.y >= 0) pTwo.y -= 13;
        else if (message === "down" && pTwo.y <= 580) pTwo.y += 13;
        this.emitGame(client.data, "move", match.id, pTwo.y, 2);
      }
      client.data.posPlayerOne = pOne;
      client.data.posPlayerTwo = pTwo;
      this.saveDataOnAllSocket(client.data, pOne, pTwo);
    } catch {}
  }

  saveDataOnAllSocket(player: any, pOne, pTwo): void {
    try {
      if (!player.user) return;
      const sockets: any[] = Array.from(this.server.sockets.values());
      sockets.forEach((socket) => {
        if (player.game == socket.data.game) {
          socket.data.posPlayerOne = pOne;
          socket.data.posPlayerTwo = pTwo;
        }
      });
    } catch {}
  }

  async handleDisconnect(client: Socket) {
    try {
      let match: Matchs = client.data.match;
      if (match) {
        match = await this.matchService.getMatchsId(match.id, [
          { withUsers: true },
        ]);
        if (match.status === MatchStatus.PENDING)
          await this.matchService.deleteMatch(match.id);
        else if (
          match.status === MatchStatus.STARTED &&
          match.scoreFirstPlayer != 5 &&
          match.scoreSecondPlayer != 5 &&
          (match.FirstPlayer.id === client.data.user.id ||
            match.SecondPlayer.id === client.data.user.id)
        ) {
          match.status = MatchStatus.ENDED;
          this.matchService.saveMatch(match);
          if (client.data.user === match.FirstPlayer) {
            match.scoreFirstPlayer = 0;
            match.scoreSecondPlayer = 5;
            this.userService.addWinLoose(
              match.FirstPlayer.id,
              match.SecondPlayer.id,
              "PLAYER2"
            );
          } else {
            match.scoreFirstPlayer = 5;
            match.scoreSecondPlayer = 0;
            this.userService.addWinLoose(
              match.FirstPlayer.id,
              match.SecondPlayer.id,
              "PLAYER1"
            );
          }
          this.emitGame(client.data, "gameAction", match.id, "Give up");
        }
      } else if (
        match.status === MatchStatus.STARTED &&
        (match.scoreFirstPlayer == 5 || match.scoreSecondPlayer == 5) &&
        (match.FirstPlayer.id === client.data.user.id ||
          match.SecondPlayer.id === client.data.user.id)
      ) {
        match.status = MatchStatus.ENDED;
        this.matchService.saveMatch(match);
      }
      if (client.data.waitinglist) {
        this.logger.log(
          `Client disconnected from the WaitingList: ${client.id}`
        );
      }
      const user = client.data.user;
      if (user) {
        user.in_game = UserGameStatus.OUT_GAME;
        this.userService.saveUser(user);
        this.emitGame(
          client.data,
          "notification",
          client.data.user.id,
          "outgame"
        );
      }
    } catch (err) {}
    this.logger.log(`Client disconnected from the Pong Game: ${client.id}`);
  }

  async isWaitinglist(client: Socket, user: User) {
    client.data.waitinglist = client.handshake.auth.waitinglist;
    if (client.data.waitinglist) {
      this.logger.log(`Client connected to the WaitingList: ${client.id}`);
      return true;
    }
    return false;
  }

  async isInGame(client: Socket, user: User) {
    client.data.game = client.handshake.auth.game;
    if (client.data.game) {
      const match: Matchs = await this.matchService.getMatchsId(
        client.handshake.auth.game,
        [{ withUsers: true }]
      );
      if (match) {
        client.data.match = match;
        client.data.posPlayerOne = { x: 0, y: 250 };
        client.data.posPlayerTwo = { x: 850, y: 250 };
        client.data.posBall = { x: 420, y: 400, rad: 10 };
        client.data.direction = { x: 1, y: 1 };
        client.data.velocity = 0.00005;
        match.status = MatchStatus.STARTED;
        this.matchService.saveMatch(match);
        user.in_game = UserGameStatus.IN_GAME;
        this.userService.saveUser(user);
        this.emitGame(
          client.data,
          "notification",
          client.data.user.id,
          "ingame"
        );
        this.logger.log(`Client connected to the Pong Game: ${client.id}`);
        return true;
      }
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
