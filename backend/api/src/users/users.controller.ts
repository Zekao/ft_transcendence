import {
  Controller,
  Param,
  Res,
  Query,
  Body,
  Get,
  Post,
  Delete,
  Patch,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { FileUploadDto } from "./dto/file-upload.dto";
import { Express, query } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { UserGameStatus, UserStatus } from "./users.enum";
import { JwtAuthGuard } from "../auth/guard/jwt.auth.guard";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
import { diskStorage } from "multer";
import { imageFileFilter, editFileName } from "./file-upload.utils";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import {
  AvatarApiException,
  UserApiException,
} from "./template/templated-api-exception";
import { boolean } from "yargs";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private UsersService: UsersService) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */
  @Get()
  @ApiOperation({ summary: "Return list of all existing users" })
  @ApiOkResponse({
    description: "Ok.",
    type: User,
  })
  getUsers(@Query() filters: UsersFiltesDTO): Promise<User[]> {
    if (Object.keys(filters).length)
      return this.UsersService.getUserByFilter(filters);
    return this.UsersService.getUsers();
  }

  @Get("/ranklist")
  @ApiOperation({ summary: "Return all user in ranked order" })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  getRankedUsers(): Promise<User[]> {
    return this.UsersService.getRankedUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me")
  @ApiOperation({
    summary: "Return profile of user associated with his credential",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @ApiException(() => UnauthorizedException, { description: "Unauthorized" })
  getProfile(@Request() req) {
    return req.user;
  }

  @Get("/:id")
  @ApiOperation({ summary: "Return specifc user profile" })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @ApiException(() => UnauthorizedException, { description: "Unauthorized" })
  getUserId(@Param("id") id: string): Promise<User> {
    return this.UsersService.getUserId(id);
  }

  @Get("/:id/firstname")
  @ApiOperation({
    summary: "Return the first name of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: User,
  })
  @UserApiException(() => NotFoundException)
  getFirstName(@Param("id") id: string): Promise<string> {
    return this.UsersService.getFirstName(id);
  }

  @Get("/:id/lastname")
  @ApiOperation({
    summary: "Return the last name of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @UserApiException(() => NotFoundException)
  getLastName(@Param("id") id: string): Promise<string> {
    return this.UsersService.getLastName(id);
  }

  @Get("/:id/username")
  @ApiOperation({
    summary: "Return the username of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @UserApiException(() => NotFoundException)
  getUserName(@Param("id") id: string): Promise<string> {
    return this.UsersService.getUserName(id);
  }

  @Get("/:id/email")
  @ApiOperation({
    summary: "Return email of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @UserApiException(() => NotFoundException)
  getEmail(@Param("id") id: string): Promise<string> {
    return this.UsersService.getEmail(id);
  }

  @Get("/:id/status")
  @ApiOperation({
    summary: "Return the status of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @UserApiException(() => NotFoundException)
  getStatus(@Param("id") id: string): Promise<UserStatus> {
    return this.UsersService.getStatus(id);
  }

  @Get("/:id/gameStatus")
  @ApiOperation({
    summary: "Return the game status of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @UserApiException(() => NotFoundException)
  getInGame(@Param("id") id: string): Promise<UserGameStatus> {
    return this.UsersService.getGameStatus(id);
  }

  @Get("/:id/win")
  @ApiOperation({
    summary: "Return the total win game of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @UserApiException(() => NotFoundException)
  getWin(@Param("id") id: string): Promise<number> {
    return this.UsersService.getWin(id);
  }

  @Get("/:id/loose")
  @ApiOperation({
    summary: "Return the total loose game of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @UserApiException(() => NotFoundException)
  getLoose(@Param("id") id: string): Promise<number> {
    return this.UsersService.getLoose(id);
  }

  @Get("/:id/rank")
  @ApiOperation({
    summary: "Return the rank of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @UserApiException(() => NotFoundException)
  getRank(@Param("id") id: string): Promise<number> {
    return this.UsersService.getRank(id);
  }

  @Get("/:id/ratio")
  @ApiOperation({
    summary: "Return the ratio of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @UserApiException(() => NotFoundException)
  getRatio(@Param("id") id: string): Promise<string> {
    return this.UsersService.getRatio(id);
  }

  @Get("/:id/avatar")
  @ApiOperation({
    summary: "Return the avatar of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
  })
  @UserApiException(() => NotFoundException)
  getAvatar(@Param("id") id: string, @Res() res) {
    return this.UsersService.getAvatar(id, res);
  }

  @Get("/:id/friends")
  @ApiOperation({
    summary: "Return the list of friends of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
  })
  @UserApiException(() => NotFoundException)
  getFriends(@Param("id") id: string): Promise<User[]> {
    return this.UsersService.getFriends(id);
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @Post("/:id/friends/")
  @ApiOperation({
    summary: "Add a friend to a specified user profile",
  })
  addFriend( @Param("id") id: string, @Query() query): Promise<User> {                   
    return this.UsersService.addFriend(id, query.friend);
  }

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
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({
    description: "Ok.",
    type: FileUploadDto,
  })
  @UserApiException(() => NotFoundException)
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
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
  deleteUser(@Param("id") id: string): Promise<boolean> {
    return this.UsersService.deleteUser(id);
  }

  @Delete("/:id/avatar")
  @ApiOperation({
    summary: "Delete the specified avatar for the specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
  @AvatarApiException(() => UnauthorizedException)
  deleteAvatar(@Param("id") id: string): Promise<boolean> {
    return this.UsersService.deleteAvatar(id);
  }

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */

  
  @Patch("/:id")
  @ApiOperation({
    summary: "Update the specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
  patchUser(@Param("id") id: string, @Query() query): Promise<User> {
    return this.UsersService.patchUser(id, query);
  }

  @Patch("/:id/firstname")
  @ApiOperation({
    summary: "Modify the first name for the specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
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
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
  patchUserName(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchUserName(id, query.username);
  }

  @Patch("/:id/email")
  @ApiOperation({
    summary: "Modify the email for the specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
  patchEmail(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchEmail(id, query.email);
  }

  @Patch("/:id/status")
  @ApiOperation({
    summary: "Modify the status for the specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
  patchStatus(@Param("id") id: string, @Query() query): Promise<UserStatus> {
    return this.UsersService.patchStatus(id, query);
  }

  @Patch("/:id/gameStatus")
  @ApiOperation({
    summary: "Modify the game status for the specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
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
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
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
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
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
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
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
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
  patchAddWin(@Param("id") id): Promise<number> {
    return this.UsersService.patchAddWin(id);
  }

  @Patch("/:id/addLoose")
  @ApiOperation({
    summary: "Add a loose game for the specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
  patchAddLoose(@Param("id") id): Promise<number> {
    return this.UsersService.patchAddLoose(id);
  }

  @Patch("/:id/removeWin")
  @ApiOperation({
    summary: "Remove a win game for the specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
  patchRemoveWin(@Param("id") id): Promise<number> {
    return this.UsersService.patchRemoveWin(id);
  }

  @Patch("/:id/removeLoose")
  @ApiOperation({
    summary: "Remove a loose game for the specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
  patchRemoveLoose(@Param("id") id): Promise<number> {
    return this.UsersService.patchRemoveLoose(id);
  }

  @Patch("/:id/updateRatio")
  @ApiOperation({
    summary: "Update the ratio for the specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
  patchUpdateRatio(@Param("id") id): Promise<number> {
    return this.UsersService.patchUpdateRatio(id);
  }

  @Patch("/updateRank")
  @ApiOperation({
    summary: "Update the rank for the specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
  patchUpdateRank(): Promise<User[]> {
    return this.UsersService.patchUpdateRank();
  }
}
