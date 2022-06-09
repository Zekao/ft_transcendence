import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Param,
  Delete,
  Patch,
} from "@nestjs/common";
import { Channel } from "./channels.entity";
import { ChannelsService } from "./channels.service";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelPasswordDto, ChannelsDto } from "./dto/channels.dto";

@Controller("channel")
export class ChannelsController {
  constructor(private channelService: ChannelsService) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */
  @Get()
  getUsers(@Query() filters: ChannelFilteDto): Promise<Channel[]> {
    if (Object.keys(filters).length)
      return this.channelService.getChannelByFilter(filters);
    return this.channelService.getChannel();
  }
  @Get("/:id/status")
  getChannelStatus(@Param("id") id: string): Promise<string> {
    return this.channelService.getChannelStatus(id);
  }
  @Get("/:id/permission")
  getChannelPermission(@Param("id") id: string): Promise<string> {
    return this.channelService.getChannelPermissions(id);
  }
  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @Post("/create")
  createChannel(
    @Body() ChannelsDtos: ChannelsDto,
    @Body() channelPasswordDto: ChannelPasswordDto
  ): Promise<void> {
    return this.channelService.createChannel(ChannelsDtos, channelPasswordDto);
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */
  @Delete("/:id/delete")
  deleteUser(@Param("id") id: string): Promise<boolean> {
    return this.channelService.deleteChannel(id);
  }

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */
  @Patch("/:id/edit")
  editChannel(
    @Param("id") id: string,
    @Query() edit: ChannelsDto
  ): Promise<Channel> {
    return this.channelService.editChannel(id, edit);
  }
}
