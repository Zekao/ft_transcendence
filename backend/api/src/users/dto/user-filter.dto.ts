import { UserStatus } from "../users-status.enum";

export class UsersFiltesDTO {
  status?: UserStatus;
  username?: string;
}
