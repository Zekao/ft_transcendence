import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  Res,
  Inject,
  forwardRef,
  UnauthorizedException,
} from "@nestjs/common";
import * as fs from "fs";
import { UserStatus, UserGameStatus } from "./users.enum";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { AuthCredentialsDto } from "../auth/dto/auth-credentials.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { isUuid } from "../utils/utils";
import { UserDto } from "./dto/user.dto";
import { MatchsService } from "../matchs/matchs.service";
import { Matchs } from "../matchs/matchs.entity";
import { extname } from "path";

export class UserRelationsPicker {
  withFriends?: boolean;
  withBlocked?: boolean;
  withMatchs?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    @Inject(forwardRef(() => MatchsService))
    private MatchsService: MatchsService,
    private JwtService: JwtService
  ) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */
  async getUsers(RelationsPicker?: UserRelationsPicker[]): Promise<User[]> {
    const relations = [];
    if (RelationsPicker) {
      for (const relation of RelationsPicker) {
        relation.withFriends && relations.push("friends");
        relation.withBlocked && relations.push("blockedUsers");
        relation.withMatchs && relations.push("matchs");
      }
    }
    const users = await this.UserRepository.find({ relations });
    if (!users) throw new NotFoundException(`Users not found`);
    return users;
  }

  async getUserFortyTwo(FortyTwoID: number): Promise<User> {
    const users = await this.UserRepository.findOne({
      where: { FortyTwoID: FortyTwoID },
    });
    if (!users) throw new NotFoundException(`Users not found`);
    return users;
  }

  async getFriends(id: string): Promise<UserDto[]> {
    const user = await this.getUserId(id, [{ withFriends: true }]);
    if (!user.friends) return [];
    const friends: UserDto[] = user.friends.map((friend) => {
      return new UserDto(friend);
    });
    return friends;
  }

  async getMatchs(id: string): Promise<Matchs[]> {
    const users = await this.getUserId(id);
    const matches = await this.MatchsService.getMatchs();
    const matchesWithUser = [];
    for (const match of matches) {
      matchesWithUser.push(
        await this.MatchsService.getMatchsId(match.id, [{ withUsers: true }])
      );
    }
    return matchesWithUser.filter(
      (match) =>
        (match.FirstPlayer?.id || "") === users.id ||
        (match.SecondPlayer?.id || "") === users.id
    );
  }

  async getBlocked(id: string): Promise<UserDto[]> {
    const user = await this.getUserId(id, [{ withBlocked: true }]);
    if (!user.blockedUsers) return [];
    const blocked: UserDto[] = user.blockedUsers.map((blocked) => {
      return new UserDto(blocked);
    });
    return blocked;
  }

  async getUserByFilter(filter: UsersFiltesDTO): Promise<User[]> {
    const { status, username } = filter;
    let users = await this.getUsers();
    if (status) users = users.filter((user) => user.status === status);
    if (username)
      users = users.filter((user) => {
        if (user.id.includes(username)) return true;
        if (user.first_name.includes(username)) return true;
        if (user.last_name.includes(username)) return true;
        if (user.display_name.includes(username)) return true;
        if (user.user_name.includes(username)) return true;
        if (user.email.includes(username)) return true;
      });
    if (!users) throw new NotFoundException(`Users not found`);
    return users;
  }

  async getUserId(
    id: string,
    RelationsPicker?: UserRelationsPicker[]
  ): Promise<User> {
    const relations = [];
    if (RelationsPicker) {
      for (const relation of RelationsPicker) {
        relation.withFriends && relations.push("friends");
        relation.withBlocked && relations.push("blockedUsers");
        relation.withMatchs && relations.push("matchs");
      }
    }
    let found = null;
    if (isUuid(id))
      found = await this.UserRepository.findOne({
        where: { id: id },
        relations,
      });
    else
      found = await this.UserRepository.findOne({
        where: { user_name: id },
        relations,
      });
    if (!found)
      found = await this.UserRepository.findOne({
        where: { display_name: id },
        relations,
      });
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    return found;
  }

  async getRankedUsers(): Promise<User[]> {
    const users = await this.UserRepository.find({
      order: { ratio: "DESC" },
      take: 10,
    });
    if (!users) throw new NotFoundException(`Users not found`);
    return users;
  }

  async getFirstName(id: string): Promise<string> {
    return (await this.getUserId(id)).first_name;
  }

  async getLastName(id: string): Promise<string> {
    return (await this.getUserId(id)).last_name;
  }

  async getDisplayName(id: string): Promise<string> {
    return (await this.getUserId(id)).display_name;
  }

  async getUserName(id: string): Promise<string> {
    return (await this.getUserId(id)).user_name;
  }

  async getEmail(id: string): Promise<string> {
    return (await this.getUserId(id)).email;
  }

  async getStatus(id: string): Promise<UserStatus> {
    return (await this.getUserId(id)).status;
  }

  async getGameStatus(id: string): Promise<UserGameStatus> {
    return (await this.getUserId(id)).in_game;
  }

  async getWin(id: string): Promise<number> {
    return (await this.getUserId(id)).win;
  }

  async getLoose(id: string): Promise<number> {
    return (await this.getUserId(id)).loose;
  }

  async getRank(id: string): Promise<number> {
    return (await this.getUserId(id)).rank;
  }

  async getRatio(id: string): Promise<string> {
    return (await this.getUserId(id)).ratio.toPrecision(2);
  }

  async getAvatar(id: string, @Res() res) {
    return res.sendFile((await this.getUserId(id)).avatar, { root: "./image" });
  }

  async saveUser(user: User): Promise<boolean> {
    await this.UserRepository.save(user);
    return true;
  }

  async getWhoFollowMe(id: string): Promise<User[]> {
    const users: User[] = (await this.getUsers([{ withFriends: true }])).filter(
      (user) => user.id !== id
    );
    const whoFollowMe: User[] = [];
    for (const user of users) {
      if (user.friends.find((f) => f.id === id))
        whoFollowMe.push(await this.getUserId(user.id));
    }
    return whoFollowMe;
  }

  async getWhoBlockMe(id: string): Promise<User[]> {
    const users: User[] = (await this.getUsers([{ withBlocked: true }])).filter(
      (user) => user.id !== id
    );
    const whoBlockMe: User[] = [];
    for (const user of users) {
      if (user.blockedUsers.find((f) => f.id === id))
        whoBlockMe.push(await this.getUserId(user.id));
    }
    return whoBlockMe;
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  async createUsers(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { FortyTwoID, user_name, first_name, last_name } = authCredentialsDto;
    const stat = UserStatus.ONLINE;
    const user = this.UserRepository.create({
      FortyTwoID: FortyTwoID,
      status: stat,
      in_game: UserGameStatus.OUT_GAME,
      user_name: user_name,
      display_name: user_name,
      email: user_name + "@transcendence.com",
      first_name: first_name,
      last_name: last_name,
      TwoFA: false,
      matchs: [],
      win: 0,
      loose: 0,
      rank: 0,
      ratio: 1,
      First_time: true,
      color: "#ffffff",
      backgroundColor: "#808080",
      avatar: "default.png" + "?" + new Date().getTime(),
    });
    try {
      await this.UserRepository.save(user);
      this.patchUpdateRank();
    } catch (error) {
      // 23505 = error code for duplicate username
      if (error.code == "23505") {
        throw new ConflictException("Username already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async addFriend(id: string, friend_id: string): Promise<User> {
    if (friend_id == id)
      throw new BadRequestException("You can't add yourself");
    const found = await this.getUserId(id, [
      { withFriends: true },
      { withBlocked: true },
    ]);
    const friend = await this.getUserId(friend_id, [{ withBlocked: true }]);
    if (!found.friends) found.friends = [];
    if (friend.blockedUsers.find((f) => f.id === found.id))
      throw new ConflictException(`You are blocked by \`${friend_id}'`);
    if (found.friends.find((f) => f.id == friend.id))
      throw new ConflictException("Already friend");
    if (found.blockedUsers.find((f) => f.id === friend.id))
      throw new ConflictException(`You are blocked \`${friend_id}'`);
    found.friends.push(friend);
    await this.UserRepository.save(found);
    return friend;
  }

  async addBlocked(id: string, blockedUsersId: string): Promise<User> {
    if ((await this.getUserId(blockedUsersId)) === (await this.getUserId(id)))
      throw new BadRequestException("You can't block yourself");
    const found = await this.getUserId(id, [
      { withBlocked: true },
      { withFriends: true },
    ]);
    const blockedUser = await this.getUserId(blockedUsersId, [
      { withFriends: true },
    ]);
    if (!found.blockedUsers) found.blockedUsers = [];
    if (found.blockedUsers.find((f) => f.id == blockedUser.id))
      throw new ConflictException("Already blocked");
    found.blockedUsers.push(blockedUser);
    await this.UserRepository.save(found);
    if (found.friends.find((f) => f.id == blockedUser.id))
      this.removeFriend(id, blockedUsersId);
    if (blockedUser.friends.find((f) => f.id == found.id))
      this.removeFriend(blockedUsersId, id);
    return blockedUser;
  }

  async uploadFile(id: User, file: Express.Multer.File) {
    const response = {
      filename: file.filename,
    };
    const split = id.avatar.split("?");
    const name = split[split.length - 2];
    const extfile = extname(name);
    if (extfile != extname(file.filename)) {
      id.avatar = name;
      this.deleteAvatarID(id);
    }
    id.avatar = file.filename + "?" + new Date().getTime();
    await this.UserRepository.save(id);
    return response;
  }

  async addWinLoose(p1: string, p2: string, action: string) {
    const player1 = await this.getUserId(p1);
    const player2 = await this.getUserId(p2);

    if (action == "PLAYER1") {
      player1.win += 1;
      player2.loose += 1;
    } else if (action == "PLAYER2") {
      player2.win += 1;
      player1.loose += 1;
    }
    this.UserRepository.save(player1);
    this.UserRepository.save(player2);
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */
  async deleteUser(id: string): Promise<boolean> {
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    const target = await this.UserRepository.delete(found.id);
    if (target.affected === 0)
      throw new NotFoundException(`User \`${id}' not found`);
    return true;
  }

  async deleteAvatar(id: string): Promise<boolean> {
    const found = await this.getUserId(id);
    if (found.avatar == "default.png") return false;
    try {
      fs.unlinkSync("image/" + found.avatar);
    } catch (err) {}
    found.avatar = "default.png";
    await this.UserRepository.save(found);
    return true;
  }

  async deleteAvatarID(user: User): Promise<boolean> {
    if (user.avatar == "default.png") return false;
    try {
      fs.unlinkSync("image/" + user.avatar);
    } catch (err) {}
    user.avatar = "default.png";
    await this.UserRepository.save(user);
    return true;
  }

  async removeFriend(id: string, friend_id: string): Promise<User> {
    const user = await this.getUserId(id, [{ withFriends: true }]);
    if (!user.friends || !user.friends.length)
      throw new NotFoundException(`User \`${id}' has no friends`);
    const friend = await this.getUserId(friend_id);
    if (!user.friends.find((f) => f.id == friend.id))
      throw new NotFoundException(
        `User \`${id}' has no friend \`${friend_id}'`
      );
    user.friends = user.friends.filter((f) => f.id != friend.id);
    await this.UserRepository.save(user);
    return friend;
  }

  async removeBlocked(id: string, blockedUserId: string): Promise<User> {
    const user = await this.getUserId(id, [{ withBlocked: true }]);
    if (!user.blockedUsers || !user.blockedUsers.length)
      throw new NotFoundException(`User \`${id}' has no blocked users`);
    const blockedUser = await this.getUserId(blockedUserId);
    if (!user.blockedUsers.find((f) => f.id == blockedUser.id))
      throw new NotFoundException(
        `User \`${user.user_name}' has no blocked user \`${blockedUser.user_name}'`
      );
    user.blockedUsers = user.blockedUsers.filter((f) => f.id != blockedUser.id);
    await this.UserRepository.save(user);
    return blockedUser;
  }

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */

  async patchUser(id: string, body: UsersFiltesDTO): Promise<User> {
    const {
      firstname,
      lastname,
      display_name,
      email,
      status,
      ingame,
      win,
      loose,
      rank,
      ratio,
      TwoFA,
      color,
      backgroundColor,
    } = body;
    const found = await this.getUserId(id);
    if (firstname) found.first_name = firstname;
    if (lastname) found.last_name = lastname;
    if (display_name) {
      const users = await this.getUsers();
      for (const user of users) {
        if (user.display_name == display_name && user.id != id)
          throw new ConflictException(
            `Display name \`${display_name}' already used`
          );
      }
      found.display_name = display_name;
    }
    if (TwoFA != null) found.TwoFA = TwoFA;
    if (email) found.email = email;
    if (status) found.status = status;
    if (ingame) found.in_game = ingame;
    if (win) found.win = win;
    if (loose) found.loose = loose;
    if (rank) found.rank = rank;
    if (ratio) found.ratio = ratio;
    if (color) found.color = color;
    if (backgroundColor) found.backgroundColor = backgroundColor;
    await this.UserRepository.save(found);
    return found;
  }

  async patchUpdateRank(): Promise<User[]> {
    const found = await this.getRankedUsers();
    for (let i = 0; i < found.length; i++) {
      found[i].rank = i + 1;
      await this.UserRepository.save(found[i]);
    }
    return found;
  }
}
