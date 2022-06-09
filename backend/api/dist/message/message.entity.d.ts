import { User } from "../users/users.entity";
declare class Message {
    id: number;
    content: string;
    author: User;
}
export default Message;
