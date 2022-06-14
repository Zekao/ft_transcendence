import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { Matchs } from "./matchs.entity";
import { MatchsController } from "./matchs.controller";
import { MatchsService } from "./matchs.service";
import { UsersModule } from "../users/users.module";
import { GameGateway } from "./game.gateway";

@Module({
  imports: [TypeOrmModule.forFeature([Matchs]), AuthModule, UsersModule],
  controllers: [MatchsController],
  providers: [MatchsService, JwtService, GameGateway],
})
export class MatchsModule {}
