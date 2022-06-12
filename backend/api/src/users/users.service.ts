import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  Res,
  Req,
} from "@nestjs/common";
import * as fs from "fs";
import { UserStatus, UserGameStatus } from "./users.enum";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { AuthCredentialsDto } from "../auth/dto/auth-credentials.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { JwtPayload } from "../auth/interface/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { UserGameStatusDto, UserStatusDto } from "./dto/user-status.dto";
import { isUuid } from "../utils/utils";
import { UserDto } from "./dto/user.dto";
import * as bcrypt from "bcrypt";

export class UserRelationsPicker {
  withFriends?: boolean;
  withBlocked?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
	@InjectRepository(User) private UserRepository: Repository<User>,
	private JwtService: JwtService
  ) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */
  async getUsers(): Promise<User[]> {
	const users = await this.UserRepository.find();
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
	const user = await this.getUserId(id, { withFriends: true });
	if (!user.friends) return [];
	const friends: UserDto[] = user.friends.map((friend) => {
	  return new UserDto(friend);
	});
	return friends;
  }

  async getBlocked(id: string): Promise<UserDto[]> {
	  const user = await this.getUserId(id, { withBlocked: true });
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
		if (user.user_name.includes(username)) return true;
		if (user.email.includes(username)) return true;
	  });
	if (!users) throw new NotFoundException(`Users not found`);
	return users;
  }

  async getUserId(
	id: string,
	RelationsPicker?: UserRelationsPicker
  ): Promise<User> {
	const relations = [];
	if (RelationsPicker) {
		RelationsPicker.withFriends && relations.push("friends");
		RelationsPicker.withBlocked && relations.push("blockedUsers");
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
	return res.sendFile((await this.getUserId(id)).avatar, { root: "./files" });
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  async createUsers(authCredentialsDto: AuthCredentialsDto): Promise<void> {
	const { FortyTwoID, user_name, first_name, last_name, avatar } =
	  authCredentialsDto;
	const stat = UserStatus.ONLINE;
	const user = this.UserRepository.create({
	  FortyTwoID: FortyTwoID,
	  status: stat,
	  in_game: UserGameStatus.OUT_GAME,
	  user_name: user_name,
	  email: user_name + "@transcendence.com",
	  first_name: first_name,
	  last_name: last_name,
	  win: 0,
	  loose: 0,
	  rank: 0,
	  ratio: 1,
	  avatar: avatar,
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
	const found = await this.getUserId(id, { withFriends: true });
	const friend = await this.getUserId(friend_id, { withBlocked: true });
	if (!found.friends) found.friends = [];
	if (friend.blockedUsers.find((f) => f.id === found.id))
		throw new ConflictException(`You are blocked by \`${friend_id}'`);
	if (found.friends.find((f) => f.id == friend.id))
	  throw new ConflictException("Already friend");
	found.friends.push(friend);
	this.UserRepository.save(found);
	return friend;
  }

	async addBlocked(id: string, blockedUsersId: string) {
		if (blockedUsersId === id)
			throw new BadRequestException("You can't add yourself");
		const found = await this.getUserId(id, { withBlocked: true });
		const blockedUser = await this.getUserId(blockedUsersId, { withFriends: true });
		if (!found.blockedUsers) found.blockedUsers = [];
		if (found.blockedUsers.find((f) => f.id == blockedUser.id))
			throw new ConflictException("Already blocked");
		found.blockedUsers.push(blockedUser);
		this.UserRepository.save(found);
		if (blockedUser.friends.find((f) => f.id == found.id))
			this.removeFriend(blockedUsersId, id);
		return blockedUser;
  	}

  async uploadFile(id: string, file: Express.Multer.File) {
	const found = await this.getUserId(id);
	if (!found) throw new NotFoundException(`User \`${id}' not found`);
	if (!file) throw new NotFoundException(`Avatar not found`);
	const response = {
	  originalname: file.originalname,
	  filename: file.filename,
	};
	if (found.avatar != "default/img_avatar.png") {
	  this.deleteAvatar(id);
	}
	found.avatar = file.filename;
	this.UserRepository.save(found);
	return response;
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */
  async deleteUser(id: string): Promise<boolean> {
	const found = await this.getUserId(id);
	if (!found) throw new NotFoundException(`User \`${id}' not found`);
	const target = await this.UserRepository.delete(found);
	if (target.affected === 0)
	  throw new NotFoundException(`User \`${id}' not found`);
	return true;
  }

  async deleteAvatar(id: string): Promise<boolean> {
	const found = await this.getUserId(id);
	if (!found) throw new NotFoundException(`User \`${id}' not found`);
	if (found.avatar == "default/img_avatar.png")
	  throw new UnauthorizedException(`Default avatar cannot be deleted`);
	try {
	  fs.unlinkSync("./files/" + found.avatar);
	  found.avatar = "default/img_avatar.png";
	  this.UserRepository.save(found);
	} catch (err) {
	  throw new NotFoundException(`Avatar \`${id}' not found`);
	}
	return true;
  }

  async removeFriend(id: string, friend_id: string): Promise<User> {
	const user = await this.getUserId(id, { withFriends: true });
	if (!user.friends || !user.friends.length) throw new NotFoundException(`User \`${id}' has no friends`);
	const friend = await this.getUserId(friend_id);
	if (!user.friends.find((f) => f.id == friend.id)) throw new NotFoundException (`User \`${id}' has no friend \`${friend_id}'`);
	user.friends = user.friends.filter((f) => f.id != friend.id);
	this.UserRepository.save(user);
	return friend;
  }

  async removeBlocked(id: string, blockedUsersId: string): Promise<User> {
	const user = await this.getUserId(id, { withBlocked: true });
	if (!user.blockedUsers || !user.blockedUsers.length) throw new NotFoundException(`User \`${id}' has no blocked users`);
	const blockedUser = await this.getUserId(id);
	if (!user.blockedUsers.find((f) => f.id == blockedUser.id)) throw new NotFoundException (`User \`${id}' has no blocked user \`${blockedUsersId}'`);
	user.blockedUsers = user.blockedUsers.filter((f) => f.id == blockedUser.id);
	this.UserRepository.save(user);
	return blockedUser;
}

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */

  async patchUser(id: string, query: UsersFiltesDTO): Promise<User> {
	const {
	  firstname,
	  lastname,
	  email,
	  status,
	  ingame,
	  win,
	  loose,
	  rank,
	  ratio,
	} = query;
	const found = await this.getUserId(id);
	if (firstname) found.first_name = firstname;
	if (lastname) found.last_name = lastname;
	if (email) found.email = email;
	if (status) found.status = status;
	if (ingame) found.in_game = ingame;
	if (win) found.win = win;
	if (loose) found.loose = loose;
	if (rank) found.rank = rank;
	if (ratio) found.ratio = ratio;
	this.UserRepository.save(found);
	return found;
  }

  async patchUpdateRank(): Promise<User[]> {
	const found = await this.getRankedUsers();
	for (let i = 0; i < found.length; i++) {
	  found[i].rank = i + 1;
	  this.UserRepository.save(found[i]);
	}
	return found;
  }
}
