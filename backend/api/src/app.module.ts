import { Module } from "node_modulessss/@nestjs/common";
import { TypeOrmModule } from "node_modulessss/@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    UsersModule,
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
