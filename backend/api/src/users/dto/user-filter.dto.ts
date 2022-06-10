import { UserStatus } from "../users.enum";

export class UsersFiltesDTO {
  status?: UserStatus;
  username?: string;
}
