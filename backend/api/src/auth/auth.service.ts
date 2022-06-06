import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { UsersRepository } from "./users.repository";
import * as bcrpyt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private UsersRepository: UsersRepository,
    private JwtService: JwtService
  ) {}

  async signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.UsersRepository.createUser(AuthCredentialsDto);
  }
  async signIn(
    AuthCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    const { user_name, password } = AuthCredentialsDto;
    const user = await this.UsersRepository.findOne({
      where: { user_name: user_name },
    });
    if (user && (await bcrpyt.compare(password, user.password))) {
      // return an access token for the client
      const payload: JwtPayload = { user_name };
      const accessToken: string = await this.JwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException("Incorrect password or username");
    }
  }
}
