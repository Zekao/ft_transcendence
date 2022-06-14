import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";
import { Matchs } from "src/matchs/matchs.entity";
import { MatchsModule } from "src/matchs/matchs.module";
import { MatchsService } from "src/matchs/matchs.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Matchs]),
    AuthModule,
    forwardRef(() => MatchsModule),
    MulterModule.register({
      dest: "./image",
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, MatchsService],
  exports: [UsersService],
})
export class UsersModule {}
