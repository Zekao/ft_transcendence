import { Module } from "node_modules/@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ChannelsModule } from "./channels/channels.module";
import { FriendsModule } from "./friend/friends.module";

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ChannelsModule,
    FriendsModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost", // to modify postgres
      port: 5432,
      username: "postgres",
      password: "root",
      database: "transcendence",
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
