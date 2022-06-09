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
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChannelsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("ChannelsGateway");

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  @SubscribeMessage("subChannel")
  joinChannel(
    @MessageBody() participant: string,
    @ConnectedSocket() client: Socket
  ): void {
    console.log(participant);
    const socketId = client.id;
    console.log(
      `Registering new participant... socket id: %s and participant: `,
      socketId,
      participant
    );
    //    this.server.emit("RoomID", participant);
  }

  @SubscribeMessage("exchanges")
  handleMessage(client: Socket, message: string): void {
    this.server.emit("RoomID", message);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
