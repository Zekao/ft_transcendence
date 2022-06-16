import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { ChatGateway } from "../chat/chat.gateway";
import { Chat } from "./chat.entity";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Chat])],
  controllers: [ChatController],
  providers: [ChatService, JwtService, ChatGateway],
})
export class ChatModule {}
