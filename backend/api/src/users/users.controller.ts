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
import { UserDto } from "./dto/user.dto";

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
  getUserId(@Request() req, @Param("id") id: string): Promise<User> {
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
  getFirstName(@Request() req, @Param("id") id: string): Promise<string> {
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
  getLastName(@Request() req, @Param("id") id: string): Promise<string> {
    return this.UsersService.getLastName(id);
  }

  @Get("/:id/display_name")
  @ApiOperation({
    summary: "Return the diplay name of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @UserApiException(() => NotFoundException)
  getDiplayName(@Request() req, @Param("id") id: string): Promise<string> {
    return this.UsersService.getDisplayName(id);
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
  getUserName(@Request() req, @Param("id") id: string): Promise<string> {
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
  getEmail(@Request() req, @Param("id") id: string): Promise<string> {
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
  getStatus(@Request() req, @Param("id") id: string): Promise<UserStatus> {
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
  getInGame(@Request() req, @Param("id") id: string): Promise<UserGameStatus> {
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
  getWin(@Request() req, @Param("id") id: string): Promise<number> {
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
  getLoose(@Request() req, @Param("id") id: string): Promise<number> {
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
  getRank(@Request() req, @Param("id") id: string): Promise<number> {
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
  getRatio(@Request() req, @Param("id") id: string): Promise<string> {
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
  getAvatar(@Request() req, @Param("id") id: string, @Res() res) {
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
  getFriends(@Request() req, @Param("id") id: string): Promise<UserDto[]> {
    return this.UsersService.getFriends(id);
  }

  @Get("/:id/blocked")
  @ApiOperation({
    summary: "Return the list of friends of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
  })
  @UserApiException(() => NotFoundException)
  getBlocked(@Request() req, @Param("id") id: string): Promise<UserDto[]> {
    return this.UsersService.getBlocked(id);
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @Post("/:id/friends/")
  @ApiOperation({
    summary: "Add a friend to a specified user profile",
  })
  addFriend(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    return this.UsersService.addFriend(id, query.friend);
  }

  @Post("/:id/blocked/")
  @ApiOperation({
    summary: "Add a friend to a specified user profile",
  })
  addBlocked(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    return this.UsersService.addBlocked(id, query.blocked);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/me/upload")
  @ApiOperation({
    summary: "Upload avatar for the specified user profile",
  })
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./image",
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
    @Request() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    const id = req.user;
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
  deleteUser(@Request() req, @Param("id") id: string): Promise<boolean> {
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
  deleteAvatar(@Request() req, @Param("id") id: string): Promise<boolean> {
    return this.UsersService.deleteAvatar(id);
  }

  @Delete("/:id/friends/")
  @ApiOperation({
    summary: "delete a friend to a specified user profile",
  })
  removeFriend(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    return this.UsersService.removeFriend(id, query.friend);
  }

  @Delete("/:id/blocked/")
  @ApiOperation({
    summary: "delete a friend to a specified user profile",
  })
  removeBlocked(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    return this.UsersService.removeBlocked(id, query.blocked);
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
  patchUser(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    return this.UsersService.patchUser(id, query);
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
