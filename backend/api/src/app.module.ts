import { Module } from "node_modules/@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ChatGateway } from "./chat/chat.gateway";

@Module({
  imports: [
    UsersModule,
    AuthModule,
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
  providers: [ChatGateway],
})
export class AppModule {}
