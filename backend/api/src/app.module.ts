import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "postgres",
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
