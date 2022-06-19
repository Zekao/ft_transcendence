import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/users.entity";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { FortyTwoStrategy } from "./strategy/42.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.services";
import { MatchsService } from "src/matchs/matchs.service";
import { MatchsModule } from "src/matchs/matchs.module";
import { Matchs } from "src/matchs/matchs.entity";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: "secretkey",
      signOptions: {
        expiresIn: 86400,
      },
    }),
    TypeOrmModule.forFeature([User, Matchs]),
  ],
  providers: [
    FortyTwoStrategy,
    JwtStrategy,
    UsersService,
    AuthService,
    MatchsService,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
