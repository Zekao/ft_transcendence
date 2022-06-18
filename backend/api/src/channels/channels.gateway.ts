import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import {
  ConflictException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { UsersService } from "../users/users.service";
import { AuthService } from "src/auth/auth.services";
import { ChannelsService } from "./channels.service";
import { Channel } from "./channels.entity";
import { User } from "../users/users.entity";
@WebSocketGateway({ namespace: "channel" })
export class ChannelsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly channelService: ChannelsService
  ) {}

  @WebSocketServer() server: any;
  private logger: Logger = new Logger("ChannelsGateway");

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  async addToHistory(channel: Channel, id: string, message: string) {
    if (!channel.history) channel.history = [];
    const history = { id, message: message };
    channel.history.push(history);
    await this.channelService.saveChannel(channel);
  }

  async mutePlayer(client: Socket, message: any) {
    const channel = client.data.channel;
    const user: string = message[2];
    const time = message[3];

    try {
      const completeMessage = " is mute for " + time + " minute.";
      await this.channelService.addUserToMuted(
        client.data.user.id,
        channel.id,
        {
          user: user,
          role: "",
          id: "",
        }
      );
      this.emitChannel(client.data, "channel", user, completeMessage);
    } catch (err) {
      this.emitSingle(
        client.data,
        "channel",
        client.data.user.id,
        err.response.message
      );
    }
  }

  async unmutePlayer(client: Socket, message: any) {
    const channel = client.data.channel;
    const user: string = message[2];

    try {
      const completeMessage = " is unmute";
      await this.channelService.deleteChannelMute(
        client.data.user.id,
        channel.id,
        {
          user: user,
          role: "",
          id: "",
        }
      );
      this.emitChannel(client.data, "channel", user, completeMessage);
    } catch (err) {
      this.emitSingle(
        client.data,
        "channel",
        client.data.user.id,
        err.response.message
      );
    }
  }

  async banPlayer(client: Socket, message: any) {
    const channel = client.data.channel;
    const user: string = message[2];

    try {
      const completeMessage = user + " is ban from the channel";
      await this.channelService.addUserToBanned(
        client.data.user.id,
        channel.id,
        {
          user: user,
          role: "",
          id: "",
        }
      );
      this.emitChannel(
        client.data,
        "channel",
        client.data.user.id,
        completeMessage
      );
    } catch (err) {
      this.emitSingle(
        client.data,
        "channel",
        client.data.user.id,
        err.response.message
      );
    }
  }

  async unbanPlayer(client: Socket, message: any) {
    const channel = client.data.channel;
    const user: string = message[2];

    try {
      const completeMessage = " is unban in this channel";
      await this.channelService.deleteChannelBan(
        client.data.user.id,
        channel.id,
        {
          user: user,
          role: "",
          id: "",
        }
      );
      this.emitChannel(client.data, "channel", user, completeMessage);
    } catch (err) {
      this.emitSingle(
        client.data,
        "channel",
        client.data.user.id,
        err.response.message
      );
    }
  }

  async adminPlayer(client: Socket, message: any) {
    const channel = client.data.channel;
    const user: string = message[2];

    try {
      const completeMessage = user + " is now a new admin of the channel";
      await this.channelService.addUserToAdmin(
        client.data.user.id,
        channel.id,
        {
          user: user,
          role: "",
          id: "",
        }
      );
      this.emitChannel(
        client.data,
        "channel",
        client.data.user.id,
        completeMessage
      );
    } catch (err) {
      this.emitSingle(
        client.data,
        "channel",
        client.data.user.id,
        err.response.message
      );
    }
  }

  async unadminPlayer(client: Socket, message: any) {
    const channel = client.data.channel;
    const user: string = message[2];

    try {
      const completeMessage = user + " is not more an admin of this channel";
      await this.channelService.deleteChannelAdmin(
        client.data.user.id,
        channel.id,
        {
          user: user,
          role: "",
          id: "",
        }
      );
      this.emitChannel(
        client.data,
        "channel",
        client.data.user.id,
        completeMessage
      );
    } catch (err) {
      this.emitSingle(
        client.data,
        "channel",
        client.data.user.id,
        err.response.message
      );
    }
  }

  async deletePlayerMember(client: Socket) {
    const channel = client.data.channel;
    const user: User = client.data.user;
    try {
      const completeMessage =
        user.display_name + " is not more a member of this channel";
      await this.channelService.deleteChannelMember(
        client.data.user.id,
        channel.id,
        {
          user: user.id,
          role: "",
          id: "",
        }
      );
      this.emitChannel(
        client.data,
        "channel",
        client.data.user.id,
        completeMessage
      );
    } catch (err) {
      this.emitSingle(
        client.data,
        "channel",
        client.data.user.id,
        err.response.message
      );
    }
  }

  @SubscribeMessage("channel")
  async SendMessageToChannel(client: Socket, message: any): Promise<void> {
    try {
      const channel: Channel = client.data.channel;
      const login: string = client.data.user.id;
      if (message[0] === "msg") {
        this.addToHistory(channel, login, message[1]);
        const mutedUser = await this.channelService.getChannelMembers(
          channel.id,
          {
            role: "muted",
            user: "",
            id: "",
          }
        );
        for (const el of mutedUser) {
          if (el.id === login) {
            this.emitSingle(client.data, "channel", login, "You are muted");
            return;
          }
        }
        this.emitChannel(client.data, "channel", login, message[1]);
      } else if (message[0] === "action") {
        if (message[1] === "logout") {
          this.deletePlayerMember(client);
        }
        if (message[1] === "mute") {
          this.mutePlayer(client, message);
        } else if (message[1] === "unmute") {
          this.unmutePlayer(client, message);
        } else if (message[1] === "ban") {
          this.banPlayer(client, message);
        } else if (message[1] === "unban") {
          this.unbanPlayer(client, message);
        } else if (message[1] === "admin") {
          this.adminPlayer(client, message);
        } else if (message[1] === "unadmin") {
          this.unadminPlayer(client, message);
        }
      }
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

  emitSingle(channel: any, event: string, ...args: any): void {
    try {
      if (!channel.user) return;
      const sockets: any[] = Array.from(this.server.sockets.values());
      sockets.forEach((socket) => {
        if (
          channel.ConnectedChannel == socket.data.ConnectedChannel &&
          socket.data.user === channel.user
        )
          socket.emit(event, ...args);
      });
    } catch {}
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async createOrAddUserToChannel(client: Socket) {
    try {
      const channel = await this.channelService.getChannelMembers(
        client.data.channel.id
      );
      for (const el of channel) {
        if (el.id === client.data.user.id) return;
      }
      await this.channelService.addUserToMember(
        client.data.user.id,
        client.data.channel.id,
        {
          user: client.data.user.id,
          role: "",
          id: "",
        }
      );
    } catch (err) {}
  }

  async isChannel(client: Socket) {
    client.data.ConnectedChannel = client.handshake.auth.channel;
    client.data.password = client.handshake.auth.password;
    if (client.data.ConnectedChannel && client.data.password) {
      client.data.channel = await this.channelService.getChannelId(
        client.data.ConnectedChannel,
        client.data.password
      );
      if (client.data.channel == false) return false;
      else {
        await this.createOrAddUserToChannel(client);
        this.logger.log(`Client connected: ${client.id}`);
        return true;
      }
    }
    return false;
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const user = await this.authService.getUserFromSocket(client);
      client.data.user = user;
      if (await this.isChannel(client)) return;
      throw new UnauthorizedException("You must specify a channel, or msg");
    } catch (err) {
      return client.disconnect();
    }
  }
}
