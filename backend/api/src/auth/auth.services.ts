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

@Injectable()
export class AuthService {
  constructor(
    private JwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UsersService
  ) {}
  GenerateJwtToken(FortyTwoID: number) {
    const payload: FortyTwoUser = { FortyTwoID };
    const accessToken: string = this.JwtService.sign(payload);
    console.log(payload);
    console.log(accessToken);
    return { accessToken };
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
      // return an access token for the client
      this.GenerateJwtToken(FortyTwoID);
    } else {
      throw new UnauthorizedException("Incorrect user id");
    }
  }

  async signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userService.createUsers(AuthCredentialsDto);
  }
}
