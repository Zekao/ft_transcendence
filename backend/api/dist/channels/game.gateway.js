"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const users_service_1 = require("../users/users.service");
const auth_services_1 = require("../auth/auth.services");
const users_enum_1 = require("../users/users.enum");
const matchs_service_1 = require("../matchs/matchs.service");
const matchs_enum_1 = require("../matchs/matchs.enum");
let GameGateway = class GameGateway {
    constructor(matchService, userService, authService) {
        this.matchService = matchService;
        this.userService = userService;
        this.authService = authService;
        this.logger = new common_1.Logger("GameGateway");
    }
    afterInit(server) {
        this.logger.log("Init");
    }
    async waitingList(client, message) {
        try {
            const player = client.data.user;
            if (message === "join") {
                const findedMatch = await this.matchService.defineMatch(client.data.user);
                if (findedMatch.id) {
                    client.data.match = findedMatch;
                    console.log("FIND A MATCH");
                    this.emitReady(client.data, "wait", "ready", findedMatch.id);
                }
                else {
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
        }
        catch (_a) { }
    }
    emitReady(player, event, ...args) {
        try {
            if (!player.user)
                return;
            const sockets = Array.from(this.server.sockets.values());
            sockets.forEach((socket) => {
                if (player.game == socket.data.game)
                    socket.emit(event, socket.data.user.user_name, ...args);
            });
        }
        catch (_a) { }
    }
    async GameAction(client, message) {
        const match = client.data.match;
        const user = client.data.user;
        if (message == "FINISH") {
            console.log("GAME IS FINISH");
            match.status = matchs_enum_1.MatchStatus.ENDED;
            this.matchService.saveMatch(match);
            client.data.match = null;
            client.disconnect();
        }
        else if (message == "updateBall" &&
            user.user_name === match.SecondPlayer.user_name)
            this.updateBall(client);
    }
    async updateBall(client) {
        let direction = client.data.direction;
        let ball = client.data.posBall;
        let velocity = client.data.velocity;
        const match = client.data.match;
        const pOne = client.data.posPlayerOne;
        const pTwo = client.data.posPlayerTwo;
        if (!ball.x || !ball.y) {
            ball.x = 420;
            ball.y = 400;
        }
        if (match.scoreFirstPlayer >= 5 || match.scoreSecondPlayer >= 5) {
            this.emitGame(client.data, "gameAction", "FINISH");
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
        this.emitGame(client.data, "gameAction", "moveBall", ball.x, ball.y);
        this.collisionDetect(client);
        ball = client.data.posBall;
        if (ball.x <= 0) {
            if (match.scoreSecondPlayer >= 5) {
                this.emitGame(client.data, "gameAction", "FINISH");
            }
            else {
                velocity = 0.00005;
                this.matchService.addOnePointToPlayer(match, "TWO");
                this.emitGame(client.data, "gameAction", "addTwo");
                this.resetBall(client);
            }
        }
        else if (ball.x >= 850) {
            if (match.scoreFirstPlayer >= 5) {
                this.emitGame(client.data, "gameAction", "FINISH");
            }
            else {
                velocity = 0.00005;
                this.matchService.addOnePointToPlayer(match, "ONE");
                this.emitGame(client.data, "gameAction", "addOne");
                this.resetBall(client);
            }
        }
        if (ball.x < 0 || ball.x > 850) {
            direction.x = -direction.x;
        }
        if (ball.y < 0 || ball.y > 720) {
            direction.y = -direction.y;
        }
        if (ball.x >= pOne.x &&
            ball.x <= pOne.x + 20 &&
            ball.y >= pOne.y &&
            ball.y <= pOne.y + 120) {
            direction.x = -direction.x;
        }
        if (ball.x >= pTwo.x &&
            ball.x <= pTwo.x + 20 &&
            ball.y >= pTwo.y &&
            ball.y <= pTwo.y + 120) {
            direction.x = -direction.x;
        }
        if (velocity < 0.05)
            velocity += 0.00005;
        velocity += 0.00005;
        this.saveAllData(client, direction, velocity, ball);
    }
    saveAllData(client, direction, velocity, ball) {
        if (direction)
            client.data.direction = direction;
        if (velocity)
            client.data.velocity = velocity;
        if (ball)
            client.data.ball = ball;
    }
    collisionDetect(client) {
        const direction = client.data.direction;
        const ball = client.data.posBall;
        const pOne = client.data.posPlayerOne;
        const pTwo = client.data.posPlayerTwo;
        if (ball.x + ball.rad >= pOne.x &&
            ball.x - ball.rad <= pOne.x + 20 &&
            ball.y + ball.rad >= pOne.y &&
            ball.y - ball.rad <= pOne.y + 120) {
            ball.x += 4;
            direction.x = -direction.x;
        }
        else if (ball.x + ball.rad >= pTwo.x &&
            ball.x - ball.rad <= pTwo.x + 20 &&
            ball.y + ball.rad >= pTwo.y &&
            ball.y - ball.rad <= pTwo.y + 120) {
            ball.x -= 4;
            direction.x = -direction.x;
        }
        this.saveAllData(client, direction, null, ball);
    }
    randomNumberBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    resetBall(client) {
        let direction = client.data.direction;
        const ball = client.data.posBall;
        ball.x = 420;
        ball.y = 400;
        direction = { x: 0 };
        while (Math.abs(direction.x) <= 0.2 || Math.abs(direction.x) >= 0.9) {
            const heading = this.randomNumberBetween(0, 2 * Math.PI);
            direction = { x: Math.cos(heading), y: Math.sin(heading) };
        }
    }
    async gamecontrol(client, message) {
        try {
            const pOne = client.data.posPlayerOne;
            const pTwo = client.data.posPlayerTwo;
            const player = client.data.user;
            const match = client.data.match;
            if (player.user_name == match.FirstPlayer.user_name) {
                if (message === "up" && pOne.y >= 0)
                    pOne.y -= 13;
                else if (message === "down" && pOne.y <= 580)
                    pOne.y += 13;
                this.emitGame(client.data, "move", pOne.y, 1);
            }
            else {
                if (message === "up" && pTwo.y >= 0)
                    pTwo.y -= 13;
                else if (message === "down" && pTwo.y <= 580)
                    pTwo.y += 13;
                this.emitGame(client.data, "move", pTwo.y, 2);
            }
            client.data.posPlayerOne = pOne;
            client.data.posPlayerOne = pTwo;
        }
        catch (_a) { }
    }
    emitGame(player, event, ...args) {
        try {
            if (!player.user)
                return;
            const sockets = Array.from(this.server.sockets.values());
            sockets.forEach((socket) => {
                if (player.game == socket.data.game)
                    socket.emit(event, ...args);
            });
        }
        catch (_a) { }
    }
    async handleDisconnect(client) {
        const waiting = client.data.waiting;
        const user = client.data.user;
        try {
            if (client.data.match &&
                client.data.match.status === matchs_enum_1.MatchStatus.PENDING) {
                await this.matchService.deleteMatch(client.data.match.id);
            }
            if (user || waiting) {
                user.in_game = users_enum_1.UserGameStatus.OUT_GAME;
                this.userService.saveUser(user);
            }
        }
        catch (err) { }
        console.log("OUT GAME");
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async isWaitinglist(client, user) {
        client.data.waitinglist = client.handshake.auth.waitinglist;
        if (client.data.waitinglist) {
            console.log("CONNECTED TO SOCKET GAME");
            this.logger.log(`Client connected: ${client.id}`);
            return true;
        }
        return false;
    }
    async isInGame(client, user) {
        const match = await this.matchService.getMatchsId(client.handshake.auth.game, [{ withUsers: true }]);
        client.data.match = match;
        client.data.game = client.handshake.auth.game;
        client.data.posPlayerOne = { x: 0, y: 250 };
        client.data.posPlayerTwo = { x: 850, y: 250 };
        client.data.posBall = { x: 420, y: 400, rad: 10 };
        client.data.direction = { x: 1, y: 1 };
        client.data.velocity = 0.00005;
        if (client.data.game) {
            user.in_game = users_enum_1.UserGameStatus.IN_GAME;
            this.userService.saveUser(user);
            console.log("CONNECTED TO THE PONG GAME");
            this.logger.log(`Client connected: ${client.id}`);
            return true;
        }
        return false;
    }
    async handleConnection(client, ...args) {
        try {
            const user = await this.authService.getUserFromSocket(client);
            client.data.user = user;
            if ((await this.isWaitinglist(client, user)) != false)
                return;
            if (this.isInGame(client, user))
                return;
            throw new common_1.UnauthorizedException("You must be in a game");
        }
        catch (err) {
            return client.disconnect();
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("action"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "waitingList", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("gameAction"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "GameAction", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("move"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "gamecontrol", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: "game" }),
    __metadata("design:paramtypes", [matchs_service_1.MatchsService,
        users_service_1.UsersService,
        auth_services_1.AuthService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map