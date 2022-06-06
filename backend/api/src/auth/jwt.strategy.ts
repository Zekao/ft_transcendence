import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";
import { UsersRepository } from "./users.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository
  ) {
    super({
      secretOrKey: "secretkey",
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  // fetching user form db
  async validate(payload: JwtPayload): Promise<User> {
    const { user_name } = payload;
    const user: User = await this.usersRepository.findOne({
      where: { user_name: user_name },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
