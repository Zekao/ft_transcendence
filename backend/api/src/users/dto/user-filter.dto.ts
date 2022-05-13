import { User, UserStatus } from "../users.model";

export class UsersFiltesDTO {
    status ?: UserStatus;
    search ?: string;
}