import { Body, Get, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.services";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { FortyTwoAuthGuard } from "./guard/42.auth.guard";
import { JwtAuthGuard } from "./guard/jwt.auth.guard";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @Post("/signup")
  @ApiOperation({
    summary: "Create a new user",
  })
  signup(@Body() AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(AuthCredentialsDto);
  }
  @Post("/signin")
  @ApiOperation({
    summary: "Login with an existing user",
  })
  signin(
    @Body() AuthCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(AuthCredentialsDto);
  }
  @Get("/42")
  @ApiOperation({
    summary: "Login or create of user with 42 OAuth",
  })
  @UseGuards(FortyTwoAuthGuard)
  logfortytwo(@Req() req) {
    this.authService.handleFortyTwo(req.user._json);
  }

  @Post("/test") // to check that request can be made with the jwt
  @ApiOperation({
    summary: "Debugging purpose / Check if the token work",
  })
  @UseGuards(JwtAuthGuard)
  test(@Req() req) {
    console.log(req.user);
    this.authService.GenerateJwtToken(req.user);
    // generer la jwt
    // rediriger la personne vers le front
    // console.log(req.user);
  }
}
