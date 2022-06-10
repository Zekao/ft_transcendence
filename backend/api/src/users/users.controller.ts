import {
  Controller,
  Param,
  Res,
  Query,
  Get,
  Post,
  Delete,
  Patch,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Express } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { UserGameStatus, UserStatus } from "./users-status.enum";
import { JwtAuthGuard } from "../auth/guard/jwt.auth.guard";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
import { diskStorage } from "multer";
import { imageFileFilter, editFileName } from "./file-upload.utils";
import { FortyTwoAuthGuard } from "../auth/guard/42.auth.guard";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private UsersService: UsersService) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */
  @Get()
  @ApiOperation({ summary: "Return list of all existing users" })
  getUsers(@Query() filters: UsersFiltesDTO): Promise<User[]> {
    if (Object.keys(filters).length)
      return this.UsersService.getUserByFilter(filters);
    return this.UsersService.getUsers();
  }
  @Get("/ranklist")
  @ApiOperation({ summary: "Return all user in ranked order" })
  getRankedUsers(): Promise<User[]> {
    return this.UsersService.getRankedUsers();
  }
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  @ApiOperation({
    summary: "Return profile of user associated with his credential",
  })
  getProfile(@Request() req) {
    return req.user;
  }
  @Get("/:id")
  @ApiOperation({ summary: "Return specifc user profile" })
  getUserId(@Param("id") id: string): Promise<User> {
    return this.UsersService.getUserId(id);
  }

  @Get("/:id/firstname")
  @ApiOperation({
    summary: "Return the first name of a specified user profile",
  })
  getFirstName(@Param("id") id: string): Promise<string> {
    return this.UsersService.getFirstName(id);
  }
  @Get("/:id/lastname")
  @ApiOperation({
    summary: "Return the last name of a specified user profile",
  })
  getLastName(@Param("id") id: string): Promise<string> {
    return this.UsersService.getLastName(id);
  }
  @Get("/:id/username")
  @ApiOperation({
    summary: "Return the username of a specified user profile",
  })
  getUserName(@Param("id") id: string): Promise<string> {
    return this.UsersService.getUserName(id);
  }
  @Get("/:id/email")
  @ApiOperation({
    summary: "Return email of a specified user profile",
  })
  getEmail(@Param("id") id: string): Promise<string> {
    return this.UsersService.getEmail(id);
  }
  @Get("/:id/status")
  @ApiOperation({
    summary: "Return the status of a specified user profile",
  })
  getStatus(@Param("id") id: string): Promise<UserStatus> {
    return this.UsersService.getStatus(id);
  }
  @Get("/:id/gameStatus")
  @ApiOperation({
    summary: "Return the game status of a specified user profile",
  })
  getInGame(@Param("id") id: string): Promise<UserGameStatus> {
    return this.UsersService.getGameStatus(id);
  }
  @Get("/:id/win")
  @ApiOperation({
    summary: "Return the total win game of a specified user profile",
  })
  getWin(@Param("id") id: string): Promise<number> {
    return this.UsersService.getWin(id);
  }
  @Get("/:id/loose")
  @ApiOperation({
    summary: "Return the total loose game of a specified user profile",
  })
  getLoose(@Param("id") id: string): Promise<number> {
    return this.UsersService.getLoose(id);
  }
  @Get("/:id/rank")
  @ApiOperation({
    summary: "Return the rank of a specified user profile",
  })
  getRank(@Param("id") id: string): Promise<number> {
    return this.UsersService.getRank(id);
  }
  @Get("/:id/ratio")
  @ApiOperation({
    summary: "Return the ratio of a specified user profile",
  })
  getRatio(@Param("id") id: string): Promise<string> {
    return this.UsersService.getRatio(id);
  }
  @Get("/:id/avatar")
  @ApiOperation({
    summary: "Return the avatar of a specified user profile",
  })
  getAvatar(@Param("id") id: string, @Res() res) {
    return this.UsersService.getAvatar(id, res);
  }
  @Get("/:id/avatar/path")
  @ApiOperation({
    summary: "Return the avatar path (server-side) of a specified user profile",
  })
  getAvatarPath(@Param("id") id: string) {
    return this.UsersService.getAvatarPath(id);
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @Post("/:id/avatar/upload")
  @ApiOperation({
    summary: "Upload avatar for the specified user profile",
  })
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./files",
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async uploadedFile(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.UsersService.uploadFile(id, file);
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */
  @Delete("/:id")
  @ApiOperation({
    summary: "Delete the specified user profile",
  })
  deleteUser(@Param("id") id: string): Promise<boolean> {
    return this.UsersService.deleteUser(id);
  }
  @Delete("/:id/avatar")
  @ApiOperation({
    summary: "Delete the specified avatar for the specified user profile",
  })
  deleteAvatar(@Param("id") id: string): Promise<boolean> {
    return this.UsersService.deleteAvatar(id);
  }

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */

  @Patch("/:id/firstname")
  @ApiOperation({
    summary: "Modify the first name for the specified user profile",
  })
  patchFirstName(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchFirstName(id, query.firstname);
  }
  @Patch("/:id/lastname")
  @ApiOperation({
    summary: "Modify the last name for the specified user profile",
  })
  patchLastName(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchLastName(id, query.lastname);
  }
  @Patch("/:id/username")
  @ApiOperation({
    summary: "Modify the username for the specified user profile",
  })
  patchUserName(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchUserName(id, query.username);
  }
  @Patch("/:id/email")
  @ApiOperation({
    summary: "Modify the email for the specified user profile",
  })
  patchEmail(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchEmail(id, query.email);
  }
  @Patch("/:id/status")
  @ApiOperation({
    summary: "Modify the status for the specified user profile",
  })
  patchStatus(@Param("id") id: string, @Query() query): Promise<UserStatus> {
    return this.UsersService.patchStatus(id, query);
  }
  @Patch("/:id/gameStatus")
  @ApiOperation({
    summary: "Modify the game status for the specified user profile",
  })
  patchGameStatus(
    @Param("id") id: string,
    @Query() query
  ): Promise<UserGameStatus> {
    return this.UsersService.patchUserGameStatus(id, query);
  }
  @Patch("/:id/win")
  @ApiOperation({
    summary: "Modify the number of win game for the specified user profile",
  })
  patchWin(
    @Param("id") id: string,
    @Query("win") query: number
  ): Promise<number> {
    return this.UsersService.patchWin(id, query);
  }
  @Patch("/:id/loose")
  @ApiOperation({
    summary: "Modify the number of loose game for the specified user profile",
  })
  patchLoose(
    @Param("id") id: string,
    @Query("loose") query: number
  ): Promise<number> {
    return this.UsersService.patchLoose(id, query);
  }
  @Patch("/:id/rank")
  @ApiOperation({
    summary: "Modify the rank for the specified user profile",
  })
  patchRank(
    @Param("id") id: string,
    @Query("rank") query: number
  ): Promise<number> {
    return this.UsersService.patchRank(id, query);
  }

  @Patch("/:id/addWin")
  @ApiOperation({
    summary: "Add a win game for the specified user profile",
  })
  patchAddWin(@Param("id") id): Promise<number> {
    return this.UsersService.patchAddWin(id);
  }
  @Patch("/:id/addLoose")
  @ApiOperation({
    summary: "Add a loose game for the specified user profile",
  })
  patchAddLoose(@Param("id") id): Promise<number> {
    return this.UsersService.patchAddLoose(id);
  }
  @Patch("/:id/removeWin")
  @ApiOperation({
    summary: "Remove a win game for the specified user profile",
  })
  patchRemoveWin(@Param("id") id): Promise<number> {
    return this.UsersService.patchRemoveWin(id);
  }
  @Patch("/:id/removeLoose")
  @ApiOperation({
    summary: "Remove a loose game for the specified user profile",
  })
  patchRemoveLoose(@Param("id") id): Promise<number> {
    return this.UsersService.patchRemoveLoose(id);
  }
  @Patch("/:id/updateRatio")
  @ApiOperation({
    summary: "Update the ratio for the specified user profile",
  })
  patchUpdateRatio(@Param("id") id): Promise<number> {
    return this.UsersService.patchUpdateRatio(id);
  }
  @Patch("/updateRank")
  @ApiOperation({
    summary: "Update the rank for the specified user profile",
  })
  patchUpdateRank(): Promise<User[]> {
    return this.UsersService.patchUpdateRank();
  }
}
