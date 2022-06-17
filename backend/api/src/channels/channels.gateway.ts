import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Logger, UnauthorizedException } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { UsersService } from "../users/users.service";
import { AuthService } from "src/auth/auth.services";
import { ChannelsService } from "./channels.service";
import { Channel } from "./channels.entity";
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

  async addToHistory(channel: Channel, login: string, message: string) {
    if (!channel.history) channel.history = [];
    const history = { login, message: message };
    channel.history.push(history);
    await this.channelService.saveChannel(channel);
  }

  async mutePlayer(client: Socket, message: any) {
    try {
      const channel = client.data.channel;
      const user: string = message[2];
      const time = message[3];

      const completeMessage = " is mute for " + time + " minute.";
      this.channelService.addUserToMuted(client.data.user.id, channel.id, {
        user,
        role: "",
        id: "",
      });
      this.emitChannel(client.data, "channel", user, completeMessage);
    } catch (err) {}
  }

  async unmutePlayer(client: Socket, message: any) {
    const login = message[2];
    this.emitChannel(client.data, "channel", login, " is unmute");
  }

  async banPlayer(client: Socket, message: any) {
    const login = message[2];
    this.emitChannel(client.data, "channel", login, " is ban");
  }

  async unbanPlayer(client: Socket, message: any) {
    const login = message[2];
    this.emitChannel(client.data, "channel", login, " is unban");
  }

  async adminPlayer(client: Socket, message: any) {
    const login = message[2];
    this.emitChannel(client.data, "channel", login, " is admin");
  }

  async unadminPlayer(client: Socket, message: any) {
    const login = message[2];
    this.emitChannel(client.data, "channel", login, " is not more admin");
  }

  @SubscribeMessage("channel")
  async SendMessageToChannel(client: Socket, message: any): Promise<void> {
    try {
      const channel: Channel = client.data.channel;
      const login: string = client.data.user.display_name;
      if (message[0] === "msg") {
        this.addToHistory(channel, login, message[1]);
        this.emitChannel(client.data, "channel", login, message[1]);
      } else if (message[0] === "action") {
        if (message[1] === "logout") client.disconnect();
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

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
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
        try {
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
