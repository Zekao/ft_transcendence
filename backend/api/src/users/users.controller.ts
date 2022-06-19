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
  Body,
} from "@nestjs/common";
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { FileUploadDto } from "./dto/file-upload.dto";
import { Express } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
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
  constructor(private usersService: UsersService) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Return list of all existing users" })
  @ApiOkResponse({
    description: "Ok.",
    type: User,
  })
  getUsers(@Query() filters: UsersFiltesDTO): Promise<User[]> {
    if (Object.keys(filters).length)
      return this.usersService.getUserByFilter(filters);
    return this.usersService.getUsers();
  }

  @Get("/ranklist")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Return all user in ranked order" })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  getRankedUsers(): Promise<User[]> {
    return this.usersService.getRankedUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  @ApiOperation({
    summary: "Return profile of user associated with :id",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @ApiException(() => UnauthorizedException, { description: "Unauthorized" })
  @ApiOperation({ summary: "Return specifc user profile" })
  @ApiOkResponse({
    description: "Ok.",
    type: [User],
  })
  @ApiException(() => UnauthorizedException, { description: "Unauthorized" })
  getUserId(@Request() req, @Param("id") id: string): Promise<User> {
    return this.usersService.getUserId(id === "me" ? req.user.id : id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id/avatar")
  @ApiOperation({
    summary: "Return the avatar of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
  })
  @UserApiException(() => NotFoundException)
  getAvatar(@Request() req, @Param("id") id: string, @Res() res) {
    return this.usersService.getAvatar(id === "me" ? req.user.id : id, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me/friends")
  @ApiOperation({
    summary: "Return the list of friends w/crediential",
  })
  @ApiOkResponse({
    description: "Ok.",
  })
  @UserApiException(() => NotFoundException)
  getFriends(@Request() req): Promise<UserDto[]> {
    const user = req.user;
    return this.usersService.getFriends(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id/matchs")
  @ApiOperation({
    summary: "Return the list of matchs of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
  })
  @UserApiException(() => NotFoundException)
  getMatch(@Request() req, @Param("id") id: string) {
    return this.usersService.getMatchs(id === "me" ? req.user.id : id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me/blocked")
  @ApiOperation({
    summary: "Return the list of blocked users w/credential",
  })
  @ApiOkResponse({
    description: "Ok.",
  })
  @UserApiException(() => NotFoundException)
  getBlocked(@Request() req): Promise<UserDto[]> {
    const user = req.user;
    return this.usersService.getBlocked(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me/whofollowme")
  @ApiOperation({
    summary: "Return all users that are in your friends list w/credential",
  })
  @ApiOkResponse({
    description: "Ok.",
  })
  @UserApiException(() => NotFoundException)
  getWhoFollowMe(@Request() req): Promise<User[]> {
    return this.usersService.getWhoFollowMe(req.user.id);
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @UseGuards(JwtAuthGuard)
  @Post("/me/friends")
  @ApiOperation({
    summary: "Add a friend w/crediential",
  })
  addFriend(@Request() req, @Query() query): Promise<User> {
    const user = req.user;
    return this.usersService.addFriend(user.id, query.friend);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/me/blocked")
  @ApiOperation({
    summary: "Add a blocked user w/credential",
  })
  addBlocked(@Request() req, @Query() query): Promise<User> {
    const user = req.user;
    return this.usersService.addBlocked(user.id, query.blocked);
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
    const user = req.user;
    return this.usersService.uploadFile(user, file);
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */
  @UseGuards(JwtAuthGuard)
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
    return this.usersService.deleteUser(id === "me" ? req.user.id : id);
  }

  @UseGuards(JwtAuthGuard)
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
    return this.usersService.deleteAvatar(id === "me" ? req.user.id : id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/me/friends")
  @ApiOperation({
    summary: "delete a friend w/crediential",
  })
  removeFriend(@Request() req, @Query() query): Promise<User> {
    const user = req.user;
    return this.usersService.removeFriend(user.id, query.friend);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/me/blocked")
  @ApiOperation({
    summary: "delete a friend w/credential",
  })
  removeBlocked(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    const user = req.user;
    return this.usersService.removeBlocked(user.id, query.blocked);
  }

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */

  @UseGuards(JwtAuthGuard)
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
    @Body() body
  ): Promise<User> {
    return this.usersService.patchUser(id === "me" ? req.user.id : id, body);
  }

  @Patch("/updateRank")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Update the rank for the specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
    type: boolean,
  })
  @UserApiException(() => NotFoundException)
  patchUpdateRank(): Promise<User[]> {
    return this.usersService.patchUpdateRank();
  }
}
