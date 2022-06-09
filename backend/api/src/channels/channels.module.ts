import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelsController } from "./channels.controller";
import { Channel } from "./channels.entity";
import { ChannelsService } from "./channels.service";
import { ChannelsGateway } from "./channels.gateway";

@Module({
  imports: [TypeOrmModule.forFeature([Channel])],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsGateway],
})
export class ChannelsModule {}
