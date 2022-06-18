import { Matches } from "class-validator";
import { UserGameStatus, UserStatus } from "../users.enum";

export class UsersFiltesDTO {
  firstname: string;
  lastname: string;
  @Matches("^[a-zA-Z0-9]+$")
  display_name: string;
  username: string;
  email: string;
  avatar: string;
  status: UserStatus;
  ingame: UserGameStatus;
  win: number;
  loose: number;
  rank: number;
  ratio: number;
  TwoFA: boolean;
  color: number;
  backgroundColor: number;
}
