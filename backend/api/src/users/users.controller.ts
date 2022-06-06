import {
  Controller,
  Param,
  Body,
  Query,
  Get,
  Post,
  Delete,
  Patch,
} from "@nestjs/common";
import { createUserDTO } from "./dto/create-user.dto";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { UserGameStatus, UserStatus } from "./users-status.enum";
import { User } from "./users.entity";
import { UsersService } from "./users.service";

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

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */
  @Post()
  createUser(@Body() createUser: createUserDTO): Promise<User> {
    return this.UsersService.createUser(createUser);
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */
  @Delete("/:id")
  deleteUser(@Param("id") id: string) {
    return this.UsersService.deleteUser(id);
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
  patchWin(@Param("id") id: string, @Query() query): Promise<number> {
    return this.UsersService.patchWin(id, query.status);
  }
  @Patch("/:id/win")
  patchLoose(@Param("id") id: string, @Query() query): Promise<number> {
    return this.UsersService.patchLoose(id, query.status);
  }
  @Patch("/:id/win")
  patchRank(@Param("id") id: string, @Query() query): Promise<number> {
    return this.UsersService.patchRank(id, query.status);
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
}
