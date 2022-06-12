import { Module } from "node_modules/@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ChannelsModule } from "./channels/channels.module";
import { MatchesModule } from "./matches/matches.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ChannelsModule,
    MatchesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "image"),
      serveRoot: "/image",
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
