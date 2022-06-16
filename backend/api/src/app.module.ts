import { Module } from "node_modules/@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ChannelsModule } from "./channels/channels.module";
import { MatchsModule } from "./matchs/matchs.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ChatModule } from "./chat/chat.module";

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ChannelsModule,
    MatchsModule,
    ChatModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "image"),
      serveRoot: "/image",
      serveStaticOptions: {
        index: false,
      },
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "database", // to modify postgres
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
