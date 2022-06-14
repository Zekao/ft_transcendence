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
  import { JwtService } from "@nestjs/jwt";
  import { UsersService } from "../users/users.service";
  import { AuthService } from "src/auth/auth.services";
  import { ChannelsService } from "./channels.service";
  import { UserGameStatus, UserStatus } from "../users/users.enum";
  import { User } from "../users/users.entity";
  import { Channel } from "./channels.entity";

  @WebSocketGateway({namespace: "game"})
  export class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
	constructor(
	  private readonly jwtService: JwtService,
	  private readonly userService: UsersService,
	  private readonly authService: AuthService,
	  private readonly channelService: ChannelsService
	) {}

	@WebSocketServer() server: any;
	private logger: Logger = new Logger("GameGateway");

	afterInit(server: Server) {
	  this.logger.log("Init");
	}

	@SubscribeMessage("connection")
	async gamecontrol(client: Socket, message: string): Promise<void> {
	  try {
		// const channel: Channel = client.data.channel;
		// const login: string = client.data.user.display_name;
		// if (!channel.history) channel.history = [];
		// const history = { login, message };
		// channel.history.push(history);
		// this.channelService.saveChannel(channel);
		this.emitChannel(client.data, "channel", message);
	  } catch {}
	}

	emitChannel(channel: any, event: string, ...args: any): void {
	  try {
		if (!channel.user) return;
		const sockets: any[] = Array.from(this.server.sockets.sockets.values());
		sockets.forEach((socket) => {
		  if (channel.ConnectedChannel == socket.data.ConnectedChannel)
			socket.emit(event, ...args);
		});
	  } catch {}
	}

	handleDisconnect(client: Socket) {
	  const user = client.data.user;
	  if (client.data.game)
	  {
		user.in_game = UserGameStatus.OUT_GAME;
		this.userService.saveUser(user);
	  }
	  console.log("OUT GAME");
	  this.logger.log(`Client disconnected: ${client.id}`);
	}

	isInGame(client: Socket, user: User) {
	  client.data.game = client.handshake.headers.game
	  if (client.data.game) {
		user.in_game = UserGameStatus.IN_GAME;
		this.userService.saveUser(user);
		console.log("IN_GAME");
		this.logger.log(`Client connected: ${client.id}`);
		return true;
	  }
	  return false;
	}

	async handleConnection(client: Socket, ...args: any[]) {
	  try {
		const user = await this.authService.getUserFromSocket(client);
		client.data.user = user;
		if (this.isInGame(client, user))
		  return ;
		throw new UnauthorizedException("You must specify a channel, or msg");
	  } catch (err) {
		return client.disconnect();
	  }
	}
  }
