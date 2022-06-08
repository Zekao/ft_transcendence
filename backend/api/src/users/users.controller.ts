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
} from "@nestjs/common";
import { Express } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { UserGameStatus, UserStatus } from "./users-status.enum";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
import { diskStorage } from "multer";
import { imageFileFilter, editFileName } from "./file-upload.utils";

@Controller("users")
export class UsersController {
  constructor(private UsersService: UsersService) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */
  @Get()
  getUsers(@Query() filters: UsersFiltesDTO): Promise<User[]> {
    if (Object.keys(filters).length)
      return this.UsersService.getUserByFilter(filters);
    return this.UsersService.getUsers();
  }
  @Get("/ranklist")
  getRankedUsers(): Promise<User[]> {
    return this.UsersService.getRankedUsers();
  }
  @Get("/:id")
  getUserId(@Param("id") id: string): Promise<User> {
    return this.UsersService.getUserId(id);
  }

  @Get("/:id/firstname")
  getFirstName(@Param("id") id: string): Promise<string> {
    return this.UsersService.getFirstName(id);
  }
  @Get("/:id/lastname")
  getLastName(@Param("id") id: string): Promise<string> {
    return this.UsersService.getLastName(id);
  }
  @Get("/:id/username")
  getUserName(@Param("id") id: string): Promise<string> {
    return this.UsersService.getUserName(id);
  }
  @Get("/:id/email")
  getEmail(@Param("id") id: string): Promise<string> {
    return this.UsersService.getEmail(id);
  }
  @Get("/:id/status")
  getStatus(@Param("id") id: string): Promise<UserStatus> {
    return this.UsersService.getStatus(id);
  }
  @Get("/:id/gameStatus")
  getInGame(@Param("id") id: string): Promise<UserGameStatus> {
    return this.UsersService.getGameStatus(id);
  }
  @Get("/:id/win")
  getWin(@Param("id") id: string): Promise<number> {
    return this.UsersService.getWin(id);
  }
  @Get("/:id/loose")
  getLoose(@Param("id") id: string): Promise<number> {
    return this.UsersService.getLoose(id);
  }
  @Get("/:id/rank")
  getRank(@Param("id") id: string): Promise<number> {
    return this.UsersService.getRank(id);
  }
  @Get("/:id/ratio")
  getRatio(@Param("id") id: string): Promise<string> {
    return this.UsersService.getRatio(id);
  }
  @Get("/:id/avatar")
  getAvatar(@Param("id") id: string, @Res() res) {
    return this.UsersService.getAvatar(id, res);
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @Post("/:id/upload")
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
  deleteUser(@Param("id") id: string) {
    return this.UsersService.deleteUser(id);
  }
  @Delete("/:id/avatar")
  deleteAvatar(@Param("id") id: string) {
    return this.UsersService.deleteAvatar(id);
  }

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */

  @Patch("/:id/firstname")
  patchFirstName(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchFirstName(id, query.firstname);
  }
  @Patch("/:id/lastname")
  patchLastName(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchLastName(id, query.lastname);
  }
  @Patch("/:id/username")
  patchUserName(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchUserName(id, query.username);
  }
  @Patch("/:id/email")
  patchEmail(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchEmail(id, query.email);
  }
  @Patch("/:id/status")
  patchStatus(@Param("id") id: string, @Query() query): Promise<UserStatus> {
    return this.UsersService.patchStatus(id, query.status);
  }
  @Patch("/:id/gameStatus")
  patchGameStatus(
    @Param("id") id: string,
    @Query() query
  ): Promise<UserGameStatus> {
    return this.UsersService.patchUserGameStatus(id, query.status);
  }
  @Patch("/:id/win")
  patchWin(
    @Param("id") id: string,
    @Query("win") query: number
  ): Promise<number> {
    return this.UsersService.patchWin(id, query);
  }
  @Patch("/:id/loose")
  patchLoose(
    @Param("id") id: string,
    @Query("loose") query: number
  ): Promise<number> {
    return this.UsersService.patchLoose(id, query);
  }
  @Patch("/:id/rank")
  patchRank(
    @Param("id") id: string,
    @Query("rank") query: number
  ): Promise<number> {
    return this.UsersService.patchRank(id, query);
  }

  @Patch("/:id/addWin")
  patchAddWin(@Param("id") id): Promise<number> {
    return this.UsersService.patchAddWin(id);
  }
  @Patch("/:id/addLoose")
  patchAddLoose(@Param("id") id): Promise<number> {
    return this.UsersService.patchAddLoose(id);
  }
  @Patch("/:id/removeWin")
  patchRemoveWin(@Param("id") id): Promise<number> {
    return this.UsersService.patchRemoveWin(id);
  }
  @Patch("/:id/removeLoose")
  patchRemoveLoose(@Param("id") id): Promise<number> {
    return this.UsersService.patchRemoveLoose(id);
  }
  @Patch("/:id/updateRatio")
  patchUpdateRatio(@Param("id") id): Promise<number> {
    return this.UsersService.patchUpdateRatio(id);
  }
  @Patch("/updateRank")
  patchUpdateRank(): Promise<User[]> {
    return this.UsersService.patchUpdateRank();
  }
}
