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
  Req,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
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

  @UseGuards(JwtAuthGuard)
  @Get("/:id/password")
  @ApiOperation({
    summary: "Validate password of a channel",
  })
  getChannelPassword(@Param("id") id: string, @Body() body): Promise<Channel> {
    return this.channelService.validateChannelPassword(id, body);
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @Post("/create")
  @ApiOperation({
    summary: "Create a new channel",
  })
  createChannel(@Body() ChannelsDtos: ChannelsDto): Promise<Channel> {
    return this.channelService.createChannel(ChannelsDtos);
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
  editChannel(
    @Param("id") id: string,
    @Query() edit: ChannelsDto
  ): Promise<Channel> {
    return this.channelService.editChannel(id, edit);
  }
}
