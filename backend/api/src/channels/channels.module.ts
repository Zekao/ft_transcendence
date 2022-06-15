import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelsController } from "./channels.controller";
import { Channel } from "./channels.entity";
import { ChannelsService } from "./channels.service";
import { ChannelsGateway } from "./channels.gateway";
import { JwtService } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "src/auth/auth.module";
import { ChatGateway } from "./chat.gateway";
import { StatusGateway } from "./status.gateway";
import { GameGateway } from "./game.gateway";
import { MatchsModule } from "../matchs/matchs.module";

@Module({
  imports: [
    MatchsModule,
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([Channel]),
  ],
  controllers: [ChannelsController],
  providers: [
    ChannelsService,
    ChannelsGateway,
    ChatGateway,
    StatusGateway,
    JwtService,
    GameGateway,
  ],
})
export class ChannelsModule {}
