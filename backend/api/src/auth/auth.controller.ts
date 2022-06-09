import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.services";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { FortyTwoAuthGuard } from "./guard/42.auth.guard";
import { JwtAuthGuard } from "./guard/jwt.auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @Post("/signup")
  signup(@Body() AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userService.signUp(AuthCredentialsDto);
  }

  @Post("/signin")
  signin(
    @Body() AuthCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    return this.userService.signIn(AuthCredentialsDto);
  }

  @Post("/test") // to check that request can be made with the jwt
  @UseGuards(JwtAuthGuard)
  test(@Req() req) {
    console.log(req.user);
    this.authService.GenerateJwtToken(req.user);
    // generer la jwt
    // rediriger la personne vers le front
    // console.log(req.user);
  }
  @Post("/test/42")
  @UseGuards(FortyTwoAuthGuard)
  test42(@Req() req) {
    console.log(req.user);
  }
}
