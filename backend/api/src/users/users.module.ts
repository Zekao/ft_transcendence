import { Module } from "node_modules/@nestjs/common";
import { TypeOrmModule } from "node_modules/@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { User } from "./users.entity";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
