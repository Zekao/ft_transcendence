import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { Matchs } from "./matchs.entity";
import { MatchsController } from "./matchs.controller";
import { MatchsService } from "./matchs.service";
import { UsersModule } from "../users/users.module";
import { User } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";
import { AuthService } from "src/auth/auth.services";

@Module({
  imports: [
    TypeOrmModule.forFeature([Matchs, User]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [MatchsController],
  providers: [MatchsService, JwtService, UsersService, AuthService],
  exports: [MatchsService],
})
export class MatchsModule {}
