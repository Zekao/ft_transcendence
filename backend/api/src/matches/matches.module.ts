import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { Matches } from "./matches.entity";
import { MatchesController } from "./matches.controller";
import { MatchesService } from "./matches.service";

@Module({
  imports: [TypeOrmModule.forFeature([Matches]), AuthModule],
  controllers: [MatchesController],
  providers: [MatchesService, JwtService],
})
export class MatchesModule {}
