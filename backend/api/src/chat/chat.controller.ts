import { Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
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
  @Get()
  @ApiOperation({
    summary: "Return list of all message",
  })
  GetMessage(): Promise<Chat[]> {
    return this.chatService.GetMessage();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  @ApiOperation({
    summary: "Return list of all message about specified id",
  })
  GetHistoryMessage(@Param("id") id: string): Promise<Chat> {
    return this.chatService.GetMessageID(id);
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @UseGuards(JwtAuthGuard)
  @Post("/create")
  @ApiOperation({
    summary: "Create a new chat",
  })
  CreateNewChat(@Request() req): Promise<Chat> {
    const user = req.user;
    return this.chatService.createChat(user);
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */
}
