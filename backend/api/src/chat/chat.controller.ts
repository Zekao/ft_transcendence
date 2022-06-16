import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt.auth.guard";
import { Chat } from "./chat.entity";
import { ChatService } from "./chat.service";

@ApiTags("chat")
@Controller("chat")
export class ChatController {
  constructor(private chatService: ChatService) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  @ApiOperation({
    summary: "Return list of history about specified id",
  })
  GetHistoryMessage(@Param("id") id: string): Promise<Chat> {
    return this.chatService.GetMessageID(id);
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
