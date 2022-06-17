import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "src/users/users.entity";
import { JwtAuthGuard } from "../auth/guard/jwt.auth.guard";
import { Channel } from "./channels.entity";
import { ChannelsService } from "./channels.service";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelsDto } from "./dto/channels.dto";

@ApiTags("channel")
@Controller("channel")
export class ChannelsController {
  constructor(private channelService: ChannelsService) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  @Get()
  @ApiOperation({ summary: "Return list of all existing channels" })
  GetAllChannel(@Query() filters: ChannelFilteDto): Promise<Channel[]> {
    if (Object.keys(filters).length)
      return this.channelService.getChannelByFilter(filters);
    return this.channelService.getChannel();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id/members")
  @ApiOperation({ summary: "Return list of all members of channel" })
  getChannelMembers(@Param("id") id: string, @Query() query?): Promise<User[]> {
    return this.channelService.getChannelMembers(id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  @ApiOperation({
    summary: "Get channel info",
  })
  getChannel(@Param("id") id: string): Promise<Channel> {
    return this.channelService.getChannelId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id/history")
  @ApiOperation({
    summary: "Get message history of a channel",
  })
  getHistory(
    @Param("id") id: string
  ): Promise<{ login: string; message: string }[]> {
    return this.channelService.getChannelHistory(id);
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @UseGuards(JwtAuthGuard)
  @Post("/:id/password")
  @ApiOperation({
    summary: "Validate password of a channel",
  })
  getChannelPassword(@Param("id") id: string, @Body() body): Promise<Channel> {
    return this.channelService.validateChannelPassword(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/create")
  @ApiOperation({
    summary: "Create a new channel",
  })
  createChannel(
    @Request() req,
    @Body() ChannelsDtos: ChannelsDto
  ): Promise<Channel> {
    return this.channelService.createChannel(req.user.id, ChannelsDtos);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/members")
  @ApiOperation({
    summary: "Add a member to a channel",
  })
  addUserToMember(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    return this.channelService.addUserToMember(req.user.id, id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/admin")
  @ApiOperation({
    summary: "Add a member to a Admin channel",
  })
  addUserToAdmin(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    return this.channelService.addUserToAdmin(req.user.id, id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/mute")
  @ApiOperation({
    summary: "Add a member to a Muted Users",
  })
  addUserToMuted(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    return this.channelService.addUserToMuted(req.user.id, id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/ban")
  @ApiOperation({
    summary: "Add a member to a Banned Users",
  })
  addUserToBanned(
    @Request() req,
    @Param("id") id: string,
    @Query() query
  ): Promise<User> {
    return this.channelService.addUserToBanned(req.user.id, id, query);
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  @Delete("/:id")
  @ApiOperation({
    summary: "Delete a specified channel",
  })
  deleteUser(@Param("id") id: string): Promise<boolean> {
    return this.channelService.deleteChannel(id);
  }

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */
  @Patch("/:id")
  @ApiOperation({
    summary: "Modify attribute of a specified channel",
  })
  editChannel(@Param("id") id: string, @Body() edit): Promise<Channel> {
    console.log(edit);
    return this.channelService.editChannel(id, edit);
  }
}
