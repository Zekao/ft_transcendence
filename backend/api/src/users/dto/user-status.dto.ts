import { IsNotEmpty, IsEnum } from "class-validator";
import { UserStatus, UserGameStatus } from "../users.enum";

export class UserStatusDto {
  @IsEnum(UserStatus, {
    message: "permissions must be: ONLINE, OFFLINE",
  })
  @IsNotEmpty()
  status: UserStatus;
}

export class UserGameStatusDto {
  @IsEnum(UserGameStatus, {
    message: "permissions must be: IN_GAME, OUT_GAME",
  })
  @IsNotEmpty()
  in_game: UserGameStatus;
}
