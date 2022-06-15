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

  @Post("/qrcode")
  @ApiOperation({
    summary: "Verify if code is valid",
  })
  @UseGuards(JwtAuthGuard)
  async verifyQrCode(@Req() req, @Query() query): Promise<boolean> {
    try {
      this.verifyQrCode(query.gcode, req.user.TwoFAVerify);
    } catch (err) {}
    return true;
  }

  @Delete("/qrcode/delete")
  @ApiOperation({
    summary: "Delete qrcode image",
  })
  @UseGuards(JwtAuthGuard)
  async qrcodeDelete(@Req() req): Promise<boolean> {
    const user: User = req.user.user_name;
    const file = user + ".png";
    try {
      fs.unlinkSync("image/googe/" + file);
    } catch (err) {}
    return true;
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
