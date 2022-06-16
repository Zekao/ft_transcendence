import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt.auth.guard";
import { UsersService } from "../users/users.service";
import { Chat } from "./chat.entity";
import { ChatService } from "./chat.service";

@ApiTags("chat")
@Controller("chat")
export class ChatController {
  constructor(
    private chatService: ChatService,
    private usersService: UsersService
  ) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: "Return list of all message",
  })
  GetMessage(): Promise<Chat[]> {
    return this.chatService.GetMessage();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me/:id")
  @ApiOperation({
    summary: "Return list of all message about specified id",
  })
  async GetHistoryMessage(
    @Param("id") id: string,
    @Request() req
  ): Promise<{ login: string; message: string }[]> {
    const user = await this.usersService.getUserId(id);
    const chat = await this.chatService.FindTwoChat(user.id, req.user.id);
    return this.chatService.getHistory(chat);
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */
}
