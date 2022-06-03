import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { ChatController } from "./chat/chat.controller";

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
  controllers: [ChatController],
})
export class AppModule {}
