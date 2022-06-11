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
import { QRObjects } from "./dto/2fa.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @Get("/login")
  @ApiOperation({
    summary: "Log into intra 42",
  })
  @UseGuards(FortyTwoAuthGuard)
  logfortytwo(@Req() req) {}

  @Get("/callback")
  @ApiOperation({
    summary: "Create or login with user 42",
  })
  @UseGuards(FortyTwoAuthGuard)
  callbackfortytwo(@Req() req) {
    return this.authService.GenerateJwtToken(req.user._json.id);
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

  @Get("/qrcode") // to check that request can be made with the jwt
  @ApiOperation({
    summary: "Get image of qrcode",
  })
  async qrcode() {
    const Test = await this.authService.generateQR();
    console.log(Test);
  }
}
