import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "../users/users.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: UsersService) {}
  @Post("/signup")
  signup(@Body() AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(AuthCredentialsDto);
  }

  @Post("/signin")
  signin(
    @Body() AuthCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(AuthCredentialsDto);
  }

  @Post("/test") // to check that request can be made with the jwt
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}
