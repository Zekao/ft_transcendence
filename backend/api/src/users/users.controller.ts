import {
  Controller,
  Param,
  Body,
  Query,
  Get,
  Post,
  Delete,
  Patch,
} from "node_modules/@nestjs/common";
import { createUserDTO } from "./dto/create-user.dto";
import { UsersFiltesDTO } from "./dto/user-filter.dto";
import { UserStatus } from "./users-status.enum";
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

  @Patch("/:id")
  patchFirstName(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchFirstName(id, query.status);
  }
  @Patch("/:id")
  patchLastName(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchLastName(id, query.status);
  }
  @Patch("/:id")
  patchUserName(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchUserName(id, query.status);
  }
  @Patch("/:id")
  patchEmail(@Param("id") id: string, @Query() query): Promise<string> {
    return this.UsersService.patchEmail(id, query.status);
  }
  @Patch("/:id")
  patchStatus(@Param("id") id: string, @Query() query): Promise<UserStatus> {
    return this.UsersService.patchStatus(id, query.status);
  }
}
