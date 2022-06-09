import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interface/jwt-payload.interface";
import { User } from "../../users/users.entity";
import { Repository } from "typeorm";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly userService: UsersService
  ) {
    super({
      secretOrKey: "secretkey",
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  // fetching user form db
  async validate(payload: JwtPayload): Promise<User> {
    const { user_name } = payload;
    const user = this.userService.getUserId(user_name);
    return user;
  }
}
