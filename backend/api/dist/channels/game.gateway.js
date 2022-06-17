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
                    console.log("FIND A MATCH");
                    this.server.emit("wait", "ready", findedMatch.id);
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
    async gamecontrol(client, message) {
        try {
            const player = client.data.user;
            const match = client.data.match;
            console.log("============ DEBUG ============");
            console.log(" first player :", match.FirstPlayer.user_name);
            console.log("============ PLAYING ============");
            console.log(player.user_name);
            console.log("============ WHO ============");
            if (player.user_name == match.FirstPlayer.user_name)
                console.log("FIRST");
            let pos1 = await this.matchService.getPosFirstPlayer(match);
            let pos2 = await this.matchService.getPosSecondPlayer(match);
            if (pos1 == 0)
                pos1 = 25;
            if (pos2 == 0)
                pos2 = 25;
            console.log(pos1);
            console.log(pos2);
            if (message == "ADD1") {
                ++match.scoreFirstPlayer;
                this.matchService.saveMatch(match);
            }
            if (message == "ADD2") {
                ++match.scoreSecondPlayer;
                this.matchService.saveMatch(match);
            }
            if (message == "FINISH") {
                console.log("TEST");
                client.disconnect();
                match.status = matchs_enum_1.MatchStatus.ENDED;
                this.matchService.saveMatch(match);
            }
            if (player.user_name == match.FirstPlayer.user_name) {
                if (message == "up") {
                    await this.matchService.setPosFirstPlayer(match, pos1 - 13);
                }
                if (message == "down")
                    await this.matchService.setPosFirstPlayer(match, pos1 + 13);
                this.emitGame(client.data, "move", pos1, pos2);
            }
            else {
                if (message == "up") {
                    await this.matchService.setPosSecondPlayer(match, pos2 - 13);
                }
                if (message == "down") {
                    await this.matchService.setPosSecondPlayer(match, pos2 + 13);
                }
                this.emitGame(client.data, "move", pos1, pos2);
            }
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
        if (client.data.match && client.data.match.status === matchs_enum_1.MatchStatus.PENDING)
            await this.matchService.deleteMatch(client.data.match.id);
        if (user || waiting) {
            user.in_game = users_enum_1.UserGameStatus.OUT_GAME;
            this.userService.saveUser(user);
        }
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
        client.data.game = client.handshake.auth.game;
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
            const match = await this.matchService.getMatchsId(client.handshake.auth.game, [{ withUsers: true }]);
            client.data.match = match;
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