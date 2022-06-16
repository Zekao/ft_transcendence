import {
  Body,
  Get,
  Controller,
  Post,
  Req,
  UseGuards,
  Res,
  Param,
  Delete,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
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
import * as fs from "fs";
import { User } from "../users/users.entity";

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

  @Get("/:id/token")
  @ApiOperation({
    summary: "Debugging purpose / Generate token for specified user",
  })
  tokenGen(@Req() req, @Param("id") id: number) {
    return this.authService.GenerateJwtToken(id);
  }

  @Post("/qrcode/verify")
  @ApiOperation({
    summary: "Verify if code is valid",
  })
  @UseGuards(JwtAuthGuard)
  async verifyGToken(@Body() body): Promise<boolean> {
    try {
      if (this.authService.verifyJwtToken(body.gtoken)) return true;
    } catch (err) {}
    throw new UnauthorizedException("Acces token provided is not allowed");
  }

  @Post("/qrcode")
  @ApiOperation({
    summary: "Verify if code is valid",
  })
  @UseGuards(JwtAuthGuard)
  async verifyQrCode(@Req() req, @Query() query): Promise<{ gtoken: string }> {
    try {
      if ((await this.authService.verifyQR(query.gcode, req.user)) == true)
        return this.authService.GenerateGToken(query.gcode);
    } catch (err) {}
    throw new UnauthorizedException("GToken provided is incorrect");
  }

  @Get("/qrcode")
  @ApiOperation({
    summary: "Get image of qrcode",
  })
  @UseGuards(JwtAuthGuard)
  async qrcode(@Req() req): Promise<boolean> {
    const user: User = req.user.user_name;
    const Test = await this.authService.generateQR(req.user);
    const file = fs;
    file.writeFile(
      "image/google/" + user + ".png",
      Test.qrcode.substring(22),
      { encoding: "base64" },
      function (err) {
        if (err) {
          console.log(err);
          return false;
        } else {
          console.log("The file was saved!");
          return true;
        }
      }
    );
    return true;
  }
}
