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
exports.ChannelsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const users_service_1 = require("../users/users.service");
const auth_services_1 = require("../auth/auth.services");
const channels_service_1 = require("./channels.service");
let ChannelsGateway = class ChannelsGateway {
    constructor(userService, authService, channelService) {
        this.userService = userService;
        this.authService = authService;
        this.channelService = channelService;
        this.logger = new common_1.Logger("ChannelsGateway");
    }
    afterInit(server) {
        this.logger.log("Init");
    }
    async addToHistory(channel, id, message) {
        if (!channel.history)
            channel.history = [];
        const history = { id, message: message };
        channel.history.push(history);
        await this.channelService.saveChannel(channel);
    }
    async addMuteTime(channel, id, time) {
        if (!channel.muteTime)
            channel.muteTime = [];
        const muteTime = { id, time };
        channel.muteTime.push(muteTime);
        await this.channelService.saveChannel(channel);
    }
    async CanTalk(channel, id, time) {
        for (let el of channel.muteTime) {
            el = JSON.parse(el);
            if (el.id === id) {
                if (Math.abs(el.time - time) >= 5) {
                    await this.removeMuteTime(channel, id);
                    return true;
                }
                else
                    return false;
            }
        }
        return true;
    }
    async removeMuteTime(channel, id) {
        let i = 0;
        for (const el of channel.muteTime) {
            if (el.id === id) {
                channel.muteTime.splice(i);
                break;
            }
            i++;
        }
        await this.channelService.saveChannel(channel);
    }
    async mutePlayer(client, message) {
        const channel = client.data.channel;
        const user = await this.userService.getUserId(message[2]);
        const time = message[3];
        try {
            const completeMessage = user.display_name + " is mute for " + time + " minute.";
            await this.channelService.addUserToMuted(client.data.user.id, channel.id, {
                user: user.display_name,
                role: "",
                id: "",
            });
            await this.addMuteTime(channel, user.id, new Date().getMinutes());
            this.emitChannel(client.data, "channel", client.data.user.id, completeMessage);
        }
        catch (err) {
            this.emitSingle(client.data, "channel", client.data.user.id, err.response.message);
        }
    }
    async unmutePlayer(client, message) {
        const channel = client.data.channel;
        const user = await this.userService.getUserId(message[2]);
        try {
            const completeMessage = " is unmute";
            await this.channelService.deleteChannelMute(client.data.user.id, channel.id, {
                user: user.display_name,
                role: "",
                id: "",
            });
            await this.removeMuteTime(channel, user.id);
            this.emitChannel(client.data, "channel", client.data.user.id, completeMessage);
        }
        catch (err) {
            this.emitSingle(client.data, "channel", client.data.user.id, err.response.message);
        }
    }
    async banPlayer(client, message) {
        const channel = client.data.channel;
        const user = await this.userService.getUserId(message[2]);
        try {
            const completeMessage = user.display_name + " is ban from the channel";
            await this.channelService.addUserToBanned(client.data.user.id, channel.id, {
                user: user.display_name,
                role: "",
                id: "",
            });
            this.emitChannel(client.data, "channel", client.data.user.id, completeMessage);
        }
        catch (err) {
            this.emitSingle(client.data, "channel", client.data.user.id, err.response.message);
        }
    }
    async unbanPlayer(client, message) {
        const channel = client.data.channel;
        const user = await this.userService.getUserId(message[2]);
        try {
            const completeMessage = user.display_name + " is unban in this channel";
            await this.channelService.deleteChannelBan(client.data.user.id, channel.id, {
                user: user.display_name,
                role: "",
                id: "",
            });
            await this.channelService.addUserToMember(client.data.user.id, channel.id, {
                user: user.display_name,
                role: "",
                id: "",
            });
            this.emitChannel(client.data, "channel", client.data.user.id, completeMessage);
        }
        catch (err) {
            this.emitSingle(client.data, "channel", client.data.user.id, err.response.message);
        }
    }
    async adminPlayer(client, message) {
        const channel = client.data.channel;
        const user = await this.userService.getUserId(message[2]);
        try {
            const completeMessage = user.display_name + " is now a new admin of the channel";
            await this.channelService.addUserToAdmin(client.data.user.id, channel.id, {
                user: user.display_name,
                role: "",
                id: "",
            });
            this.emitChannel(client.data, "channel", client.data.user.id, completeMessage);
        }
        catch (err) {
            this.emitSingle(client.data, "channel", client.data.user.id, err.response.message);
        }
    }
    async unadminPlayer(client, message) {
        const channel = client.data.channel;
        const user = await this.userService.getUserId(message[2]);
        try {
            const completeMessage = user.display_name + " is not more an admin of this channel";
            await this.channelService.deleteChannelAdmin(client.data.user.id, channel.id, {
                user: user.display_name,
                role: "",
                id: "",
            });
            this.emitChannel(client.data, "channel", client.data.user.id, completeMessage);
        }
        catch (err) {
            this.emitSingle(client.data, "channel", client.data.user.id, err.response.message);
        }
    }
    async deletePlayerMember(client) {
        const channel = client.data.channel;
        const user = client.data.user;
        try {
            const completeMessage = user.display_name + " is not more a member of this channel";
            await this.channelService.deleteChannelMember(client.data.user.id, channel.id, {
                user: user.display_name,
                role: "",
                id: "",
            });
            this.emitChannel(client.data, "channel", client.data.user.id, completeMessage);
        }
        catch (err) {
            this.emitSingle(client.data, "channel", client.data.user.id, err.response.message);
        }
    }
    async SendMessageToChannel(client, message) {
        try {
            const channel = client.data.channel;
            const login = client.data.user.id;
            const banned = await this.channelService.getChannelBanMembers(channel.id);
            if (message[0] === "msg") {
                try {
                    const mutedUser = await this.channelService.getChannelMembers(channel.id, {
                        role: "muted",
                        user: "",
                        id: "",
                    });
                    for (const el of banned) {
                        if (el.id === login) {
                            this.emitSingle(client.data, "channel", login, "You are ban");
                            return;
                        }
                    }
                    for (const el of mutedUser) {
                        if (el.id === login) {
                            if ((await this.CanTalk(channel, login, new Date().getMinutes())) !=
                                false)
                                break;
                            else {
                                this.emitSingle(client.data, "channel", login, "You are muted");
                                return;
                            }
                        }
                    }
                    this.addToHistory(channel, login, message[1]);
                    this.emitChannel(client.data, "channel", login, message[1]);
                }
                catch (err) { }
            }
            else if (message[0] === "action") {
                if (message[1] === "logout")
                    this.deletePlayerMember(client);
                if (message[1] === "mute") {
                    this.mutePlayer(client, message);
                }
                else if (message[1] === "unmute") {
                    this.unmutePlayer(client, message);
                }
                else if (message[1] === "ban") {
                    this.banPlayer(client, message);
                }
                else if (message[1] === "unban") {
                    this.unbanPlayer(client, message);
                }
                else if (message[1] === "admin") {
                    this.adminPlayer(client, message);
                }
                else if (message[1] === "unadmin") {
                    this.unadminPlayer(client, message);
                }
            }
        }
        catch (_a) { }
    }
    async emitChannel(channel, event, ...args) {
        try {
            let blocked = false;
            if (!channel.user)
                return;
            const sockets = Array.from(this.server.sockets.values());
            sockets.forEach(async (socket) => {
                socket.data.user = await this.userService.getUserId(socket.data.user.id, [{ withBlocked: true }]);
                if (channel.ConnectedChannel === socket.data.ConnectedChannel) {
                    for (const el of socket.data.user.blockedUsers) {
                        if (el.id === channel.user.id) {
                            blocked = true;
                            break;
                        }
                    }
                    if (blocked === false)
                        socket.emit(event, ...args);
                    blocked = false;
                }
            });
        }
        catch (_a) { }
    }
    emitSingle(channel, event, ...args) {
        try {
            if (!channel.user)
                return;
            const sockets = Array.from(this.server.sockets.values());
            sockets.forEach((socket) => {
                if (channel.ConnectedChannel == socket.data.ConnectedChannel &&
                    socket.data.user === channel.user)
                    socket.emit(event, ...args);
            });
        }
        catch (_a) { }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async createOrAddUserToChannel(client) {
        try {
            const channel = await this.channelService.getChannelMembers(client.data.channel.id);
            for (const el of channel) {
                if (el.id === client.data.user.id)
                    return;
            }
            await this.channelService.addUserToMember(client.data.user.id, client.data.channel.id, {
                user: client.data.user.id,
                role: "",
                id: "",
            });
        }
        catch (err) { }
    }
    async isChannel(client) {
        client.data.ConnectedChannel = client.handshake.auth.channel;
        client.data.password = client.handshake.auth.password;
        if (client.data.ConnectedChannel && client.data.password) {
            client.data.channel = await this.channelService.getChannelId(client.data.ConnectedChannel, client.data.password);
            if (client.data.channel == false)
                return false;
            else {
                await this.createOrAddUserToChannel(client);
                this.logger.log(`Client connected: ${client.id}`);
                return true;
            }
        }
        return false;
    }
    async handleConnection(client, ...args) {
        try {
            const user = await this.authService.getUserFromSocket(client);
            client.data.user = user;
            if (await this.isChannel(client))
                return;
            throw new common_1.UnauthorizedException("You must specify a channel, or msg");
        }
        catch (err) {
            return client.disconnect();
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], ChannelsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("channel"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChannelsGateway.prototype, "SendMessageToChannel", null);
ChannelsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: "channel" }),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_services_1.AuthService,
        channels_service_1.ChannelsService])
], ChannelsGateway);
exports.ChannelsGateway = ChannelsGateway;
//# sourceMappingURL=channels.gateway.js.map