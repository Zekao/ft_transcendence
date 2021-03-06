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
import { ChatService } from "./chat.service";
import { Chat } from "./chat.entity";

@WebSocketGateway({ namespace: "chat" })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
    private readonly userService: UsersService
  ) {}

  @WebSocketServer() server: any;
  private logger: Logger = new Logger("ChatGateway");

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  @SubscribeMessage("msg")
  async SendPrivateMessage(client: Socket, msg: string): Promise<void> {
    try {
      client.data.chat = await this.chatService.FindTwoChat(
        client.data.user.id,
        client.data.receiver.id
      );
      const chat: Chat = client.data.chat;
      const id: string = client.data.user.id;
      const history = { id, message: msg };
      chat.history.push(history);
      this.chatService.saveChat(chat);
      this.emitChat(client.data, "msg", id, msg);
    } catch {}
  }

  emitChat(channel: any, event: string, ...args: any): void {
    try {
      if (!channel.user) return;
      const sockets: any[] = Array.from(this.server.sockets.values());
      sockets.forEach((socket) => {
        if (channel.chat.id === socket.data.chat.id)
          socket.emit(event, ...args);
      });
    } catch {}
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async isMsg(client: Socket) {
    client.data.receiver = client.handshake.auth.msg;
    if (client.data.receiver) {
      client.data.receiver = await this.userService.getUserId(
        client.data.receiver
      );
      try {
        client.data.chat = await this.chatService.FindTwoChat(
          client.data.user.id,
          client.data.receiver.id
        );
      } catch (err) {
        client.data.chat = await this.chatService.createChat(
          client.data.user,
          client.data.receiver
        );
      }
      this.logger.log(`Client connected: ${client.id}`);
      return true;
    }
    return false;
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const user = await this.authService.getUserFromSocket(client);
      client.data.user = user;
      if (this.isMsg(client)) return;
      throw new UnauthorizedException("You must specify a chat");
    } catch (err) {
      return client.disconnect();
    }
  }
}
