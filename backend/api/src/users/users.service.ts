import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  Res,
} from "@nestjs/common";
import * as fs from "fs";
import { UserStatus, UserGameStatus } from "./users-status.enum";
import { createUserDTO } from "./dto/create-user.dto";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { AuthCredentialsDto } from "../auth/dto/auth-credentials.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { JwtPayload } from "../auth/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { fstat } from "fs";

function isId(id: string): boolean {
  const splited: string[] = id.split("-");
  return (
    id.length === 36 &&
    splited.length === 5 &&
    splited[0].length === 8 &&
    splited[1].length === 4 &&
    splited[2].length === 4 &&
    splited[3].length === 4 &&
    splited[4].length === 12
  );
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
  async getUserId(id: string): Promise<User> {
    let found = null;
    if (isId(id))
      found = await this.UserRepository.findOne({ where: { id: id } });
    else
      found = await this.UserRepository.findOne({ where: { user_name: id } });
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
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    return found.first_name;
  }
  async getLastName(id: string): Promise<string> {
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    return found.last_name;
  }
  async getUserName(id: string): Promise<string> {
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    return found.user_name;
  }
  async getEmail(id: string): Promise<string> {
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    return found.email;
  }
  async getStatus(id: string): Promise<UserStatus> {
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    return found.status;
  }
  async getGameStatus(id: string): Promise<UserGameStatus> {
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    return found.in_game;
  }
  async getWin(id: string): Promise<number> {
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    return found.win;
  }
  async getLoose(id: string): Promise<number> {
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    return found.loose;
  }
  async getRank(id: string): Promise<number> {
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    return found.rank;
  }
  async getRatio(id: string): Promise<string> {
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    return found.ratio.toPrecision(2);
  }
  async getAvatar(id: string, @Res() res) {
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    return res.sendFile(found.avatar, { root: "./files" });
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  async createUsers(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { user_name, password } = authCredentialsDto;
    // hash the password with bcrypt before storing it
    const stat = UserStatus.ONLINE;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.UserRepository.create({
      status: stat,
      in_game: UserGameStatus.IN_GAME,
      user_name,
      password: hashedPassword,
      email: user_name + "@transcendence.com",
      first_name: "Fake",
      last_name: "Users",
      win: 0,
      loose: 0,
      rank: 0,
      ratio: 1,
      avatar: "default/img_avatar.png",
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

  async signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.createUsers(AuthCredentialsDto);
  }
  async signIn(
    AuthCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    const { user_name, password } = AuthCredentialsDto;
    const user = await this.UserRepository.findOne({
      where: { user_name: user_name },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      // return an access token for the client
      const payload: JwtPayload = { user_name };
      const accessToken: string = await this.JwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException("Incorrect password or username");
    }
  }

  async uploadFile(id: string, file: Express.Multer.File) {
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
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
  async deleteUser(id: string): Promise<void> {
    const target = await this.UserRepository.delete(id);
    if (target.affected === 0)
      throw new NotFoundException(`User \`${id}' not found`);
  }

  async deleteAvatar(id: string): Promise<void> {
    const found = await this.getUserId(id);
    if (!found) throw new NotFoundException(`User \`${id}' not found`);
    if (found.avatar == "default/img_avatar.png")
      throw new UnauthorizedException(`Default avatar cannot be deleted`);
    try {
      fs.unlinkSync("./files/" + found.avatar);
    } catch (err) {
      console.error(err);
      throw new NotFoundException(`Avatar \`${id}' not found`);
    }
  }

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */
  async patchFirstName(id: string, first_name: string): Promise<string> {
    const found = await this.getUserId(id);
    found.first_name = first_name;
    this.UserRepository.save(found);
    return found.first_name;
  }
  async patchLastName(id: string, last_name: string): Promise<string> {
    const found = await this.getUserId(id);
    found.last_name = last_name;
    this.UserRepository.save(found);
    return found.last_name;
  }
  async patchUserName(id: string, user_name: string): Promise<string> {
    const users = await this.getUsers();
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) continue;
      if (users[i].user_name === user_name)
        throw new ConflictException(`username \`${user_name}' already exist`);
    }
    const found = await this.getUserId(id);
    found.user_name = user_name;
    this.UserRepository.save(found);
    return found.user_name;
  }
  async patchEmail(id: string, email: string): Promise<string> {
    const found = await this.getUserId(id);
    found.email = email;
    this.UserRepository.save(found);
    return found.email;
  }
  async patchStatus(id: string, status: UserStatus): Promise<UserStatus> {
    const found = await this.getUserId(id);
    found.status = status;
    this.UserRepository.save(found);
    return found.status;
  }
  async patchUserGameStatus(
    id: string,
    in_game: UserGameStatus
  ): Promise<UserGameStatus> {
    const found = await this.getUserId(id);
    found.in_game = in_game;
    this.UserRepository.save(found);
    return found.in_game;
  }
  async patchWin(id: string, win: number): Promise<number> {
    const found = await this.getUserId(id);
    found.win = win;
    this.UserRepository.save(found);
    return found.win;
  }
  async patchLoose(id: string, loose: number): Promise<number> {
    const found = await this.getUserId(id);
    found.loose = loose;
    this.UserRepository.save(found);
    return found.loose;
  }
  async patchRank(id: string, rank: number): Promise<number> {
    const found = await this.getUserId(id);
    found.rank = rank;
    this.UserRepository.save(found);
    return found.rank;
  }

  async patchAddWin(id: string): Promise<number> {
    const found = await this.getUserId(id);
    found.win++;
    this.UserRepository.save(found);
    this.patchUpdateRatio(id);
    return found.win;
  }
  async patchAddLoose(id: string): Promise<number> {
    const found = await this.getUserId(id);
    found.loose++;
    this.UserRepository.save(found);
    this.patchUpdateRatio(id);
    return found.loose;
  }
  async patchRemoveWin(id: string): Promise<number> {
    const found = await this.getUserId(id);
    if (found.loose != 0) {
      found.win--;
      this.UserRepository.save(found);
      this.patchUpdateRatio(id);
    }
    return found.win;
  }
  async patchRemoveLoose(id: string): Promise<number> {
    const found = await this.getUserId(id);
    if (found.loose != 0) {
      found.loose--;
      this.UserRepository.save(found);
      this.patchUpdateRatio(id);
    }
    return found.loose;
  }
  async patchUpdateRatio(id: string): Promise<number> {
    const found = await this.getUserId(id);
    if (found.win != 0 || found.loose != 0) {
      found.ratio = found.win / found.loose;
    }
    this.UserRepository.save(found);
    this.patchUpdateRank();
    return found.ratio;
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
