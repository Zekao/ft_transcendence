import { UserGameStatus, UserStatus } from "../users.enum";
import { User } from "../users.entity";


export class UserDto {
 
    constructor(user?: User) {
        if (user){
            this.id = user.id;
            this.first_name = user.first_name;
            this.last_name = user.last_name;
            this.user_name = user.user_name;
            this.email = user.email;
            this.avatar = user.avatar;
            this.status = user.status;
            this.in_game = user.in_game;
            this.win = user.win;
            this.loose = user.loose;
            this.rank = user.rank;
            this.ratio = user.ratio;
            if (user.friends)
                this.friends = user.friends.map((friend) => {return new UserDto(friend)});
            if (user.blockedUsers)
                this.blockedUsers = user.blockedUsers.map((user) => {return new UserDto(user)});
            // if (user.adminChannels)
            //     this.adminChannels = user.adminChannels.map((channel) => {return new ChannelDto(channel)});
            // this.color = user.color;
            // this.stats = user.stats;
            // this.firstLog = user.firstLog;
            // this.roomId = user.roomId;
            // this.socketIdTab = user.socketIdTab;
        }
    }
    id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    avatar: string;
    status: UserStatus;
    in_game: UserGameStatus;
    win: number;
    loose: number;
    rank: number;
    ratio: number;
    friends: UserDto[];
    blockedUsers: UserDto[];
}