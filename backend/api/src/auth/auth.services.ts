import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";
import {
  AuthCodeDto,
  AuthCredentialsDto,
  AuthCredentialsFortyTwoDto,
  LoginFortyTwoDto,
} from "./dto/auth-credentials.dto";
import { JwtPayload } from "./interface/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FortyTwoUser } from "./interface/42.interface";
import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";
import { QRObjects } from "./dto/2fa.dto";
import { Socket } from "socket.io";
import * as fs from "fs";
import { GPayload } from "./interface/gtoken.interface";
import { generateName, getRandomInt } from "../utils/utils";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UsersService
  ) {}
  GenerateJwtToken(FortyTwoID: number, firstime: boolean) {
    const payload: FortyTwoUser = { FortyTwoID };
    const accessToken: string = this.jwtService.sign(payload);
    return { accessToken, firstime };
  }
  GenerateGToken(Gtoken: number) {
    const payload: GPayload = { Gtoken };
    const gtoken: string = this.jwtService.sign(payload);
    return { gtoken };
  }
  verifyJwtToken(token: string): Promise<FortyTwoUser> {
    try {
      return this.jwtService.verify(token);
    } catch (err) {}
  }

  async handleFortyTwo(Ftwo: AuthCredentialsFortyTwoDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { FortyTwoID: Ftwo.id },
    });
    if (!user) {
      const AuthCredentialsDto = {
        FortyTwoID: Ftwo.id,
        first_name: Ftwo.first_name,
        last_name: Ftwo.last_name,
        user_name: Ftwo.login,
        email: Ftwo.email,
        avatar: Ftwo.image_url,
      };
      return this.signUp(AuthCredentialsDto);
    }
    const LoginFortyTwoDto = {
      FortyTwoID: Ftwo.id,
    };
    return this.signIn(LoginFortyTwoDto);
  }

  async signIn(loginFortyTwoDto: LoginFortyTwoDto) {
    const { FortyTwoID } = loginFortyTwoDto;
    const user = await this.userRepository.findOne({
      where: { FortyTwoID: FortyTwoID },
    });
    if (user) {
      if (user.First_time === true) {
        user.First_time = false;
        await this.userService.saveUser(user);
      }

      // return an access token for the client
      this.GenerateJwtToken(FortyTwoID, user.First_time);
    } else {
      throw new UnauthorizedException("Incorrect user id");
    }
  }

  async signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userService.createUsers(AuthCredentialsDto);
  }

  async generateRandomUser(): Promise<{ accessToken, firstime }> {
    const FTwoID = getRandomInt(100, 1000);
    const AuthCredentialsDto = {
      FortyTwoID: FTwoID,
      first_name: generateName(),
      last_name: generateName(),
      user_name: generateName(),
      email: "test@transcendence.fr",
      avatar: "default.png",
    };
    this.signUp(AuthCredentialsDto);
    return this.GenerateJwtToken(FTwoID, true);
  }

  async getUserFromSocket(client: Socket): Promise<User> {
    const token = client.handshake.auth.Authorization;
    if (!token) throw new UnauthorizedException("No token provided");
    const payload = await this.verifyJwtToken(token);
    if (!payload) throw new UnauthorizedException("Invalid token provided");
    return this.userService.getUserFortyTwo(payload.FortyTwoID);
  }

  async verifyGToken(user_token: string, user: User): Promise<boolean> {
    const verified = speakeasy.totp.verify({
      secret: user.TwoFAVerify,
      encoding: "ascii",
      token: user_token,
    });
    return verified;
  }

  async generateQR(id: User): Promise<QRObjects> {
    const secret = speakeasy.generateSecret({
      name: "Ft_transcendence",
    });
    const QRObjects = {
      qrcode: await qrcode.toDataURL(secret.otpauth_url),
      secret: secret.ascii,
    };
    id.TwoFAVerify = secret.ascii;
    this.userService.saveUser(id);
    return QRObjects;
  }

  async verifyQR(user_token: string, user: User): Promise<boolean> {
    const file = user.user_name + ".png";
    try {
      fs.unlinkSync("image/google/" + file);
    } catch (err) {}
    const verified = speakeasy.totp.verify({
      secret: user.TwoFAVerify,
      encoding: "ascii",
      token: user_token,
    });
    return verified;
  }
}
