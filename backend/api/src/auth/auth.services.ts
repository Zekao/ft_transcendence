import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(private JwtService: JwtService) {}
  GenerateJwtToken(User: any) {
    const payload = { user_name: User.user_name, user_id: User.user_id };
    this.JwtService.sign(payload);
    console.log(User);
  }
}
