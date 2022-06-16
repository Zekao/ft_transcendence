import { UserGameStatus, UserStatus } from "../users.enum";
import { User } from "../users.entity";
import { MatchDto } from "../../matchs/dto/matchs.dto";
import { ChannelsDto } from "src/channels/dto/channels.dto";
import { Channel } from "src/channels/channels.entity";

export class UserDto {
  constructor(user?: User) {
    if (user) {
      this.id = user.id;
      this.FortyTwoID = user.FortyTwoID;
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.user_name = user.user_name;
      this.display_name = user.display_name;
      this.email = user.email;
      this.avatar = user.avatar;
      this.status = user.status;
      this.in_game = user.in_game;
      this.win = user.win;
      this.loose = user.loose;
      this.rank = user.rank;
      this.ratio = user.ratio;
      this.TwoFA = user.TwoFA;
      if (user.friends)
        this.friends = user.friends.map((friend) => {
          return new UserDto(friend);
        });
      if (user.blockedUsers)
        this.blockedUsers = user.blockedUsers.map((user) => {
          return new UserDto(user);
        });
      if (user.matchs)
        this.matchs = user.matchs.map((match) => {
          return new MatchDto(match);
        });
      if (user.joinedChannels)
        this.joinedChannels = user.joinedChannels.map((channel) => {
          return new Channel();
        });
      if (user.ownedChannels)
        this.ownedChannels = user.ownedChannels.map((channel) => {
          return new ChannelsDto();
        })
      if (user.adminedChannels)
        this.adminedChannels = user.adminedChannels.map((channel) => {
          return new ChannelsDto();
        });
      if (user.bannedChannels)
        this.bannedChannels = user.bannedChannels.map((channel) => {
          return new ChannelsDto();
        });
      if (user.mutedChannels)
        this.mutedChannels = user.mutedChannels.map((channel) => {
          return new ChannelsDto();
        });
    }
  }
  id: string;
  FortyTwoID: number;
  first_name: string;
  last_name: string;
  user_name: string;
  display_name: string;
  email: string;
  avatar: string;
  status: UserStatus;
  in_game: UserGameStatus;
  win: number;
  loose: number;
  rank: number;
  ratio: number;
  TwoFA: boolean;
  matchs: MatchDto[];
  friends: UserDto[];
  blockedUsers: UserDto[];
  joinedChannels: Channel[];
  ownedChannels: ChannelsDto[];
  adminedChannels: ChannelsDto[];
  mutedChannels: ChannelsDto[];
  bannedChannels: ChannelsDto[];
}
