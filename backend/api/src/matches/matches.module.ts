import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { Matches } from "./matches.entity";
import { MatchesController } from "./matches.controller";
import { MatchesService } from "./matches.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Matches]), AuthModule, UsersModule],
  controllers: [MatchesController],
  providers: [MatchesService, JwtService],
})
export class MatchesModule {}
