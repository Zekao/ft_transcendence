import { UserDto } from "../../users/dto/user.dto";
import { Chat } from "../chat.entity";
export declare class chatDTO {
    constructor(chat?: Chat);
    participants: UserDto[];
}
