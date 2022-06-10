import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interface/jwt-payload.interface";
import { User } from "../../users/users.entity";
import { Repository } from "typeorm";
import { UsersService } from "../../users/users.service";
import { FortyTwoUser } from "../interface/42.interface";

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
  async validate(payload: FortyTwoUser): Promise<User> {
    console.log(payload.FortyTwoID);
    const { FortyTwoID } = payload;
    const user = this.userService.getUserFortyTwo(FortyTwoID);
    return user;
  }
}
