import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from "bcrypt";
import { JwtPayload } from "./interface/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private JwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UsersService
  ) {}
  GenerateJwtToken(User: any) {
    const payload = { user_name: User.user_name, user_id: User.user_id };
    this.JwtService.sign(payload);
    console.log(User);
  }
  async signIn(
    AuthCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    const { user_name, password } = AuthCredentialsDto;
    const user = await this.userRepository.findOne({
      where: { user_name: user_name },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      // return an access token for the client
      const payload: JwtPayload = { user_name };
      const accessToken: string = this.JwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException("Incorrect password or username");
    }
  }
  async signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userService.createUsers(AuthCredentialsDto);
  }
}