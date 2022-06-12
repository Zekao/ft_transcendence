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

  @UseGuards(JwtAuthGuard)
  @Get("/me/friends")
  @ApiOperation({
    summary: "Return the list of friends of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
  })
  @UserApiException(() => NotFoundException)
  getFriends(@Request() req, @Param("id") id: string): Promise<UserDto[]> {
    const user = req.user;
    return this.UsersService.getFriends(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me/blocked")
  @ApiOperation({
    summary: "Return the list of friends of a specified user profile",
  })
  @ApiOkResponse({
    description: "Ok.",
  })
  @UserApiException(() => NotFoundException)
  getBlocked(@Request() req, @Param("id") id: string): Promise<UserDto[]> {
    const user = req.user;
    return this.UsersService.getBlocked(user.id);
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @UseGuards(JwtAuthGuard)
  @Post("/me/friends/")
  @ApiOperation({
    summary: "Add a friend to a specified user profile",
  })
  addFriend(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    const user = req.user;
    return this.UsersService.addFriend(user, query.friend);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/me/blocked")
  @ApiOperation({
    summary: "Add a friend to a specified user profile",
  })
  addBlocked(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    const user = req.user;
    return this.UsersService.addBlocked(user.id, query.blocked);
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
    return this.UsersService.uploadFile(user.id, file);
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

  @UseGuards(JwtAuthGuard)
  @Delete("/me/friends")
  @ApiOperation({
    summary: "delete a friend to a specified user profile",
  })
  removeFriend(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    const user = req.user;
    return this.UsersService.removeFriend(user.id, query.friend);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/me/blocked")
  @ApiOperation({
    summary: "delete a friend to a specified user profile",
  })
  removeBlocked(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    const user = req.user;
    return this.UsersService.removeBlocked(user.id, query.blocked);
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
    @Body() body
  ): Promise<User> {
    return this.UsersService.patchUser(id, body);
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
