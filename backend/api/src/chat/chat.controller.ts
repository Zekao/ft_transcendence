import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt.auth.guard";
import { UsersService } from "../users/users.service";
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
  @Get("/me/:id")
  @ApiOperation({
    summary: "Return list of all message about specified id",
  })
  async GetHistoryMessage(
    @Param("id") id: string,
    @Request() req
  ): Promise<{ id: string; message: string }[]> {
    const user = await this.usersService.getUserId(id);
    try {
      const chat = await this.chatService.FindTwoChat(user.id, req.user.id);
      return this.chatService.getHistory(chat);
    } catch (err) {}
    return null;
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
