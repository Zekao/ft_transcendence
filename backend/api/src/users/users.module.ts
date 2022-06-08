import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {}
