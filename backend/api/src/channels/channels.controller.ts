import { Body, Controller, Post, Get, Query, Param } from "@nestjs/common";
import { Channel } from "./channels.entity";
import { ChannelsService } from "./channels.service";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelsDto } from "./dto/channels.dto";

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
  createChannel(@Body() ChannelsDtos: ChannelsDto): Promise<void> {
    return this.channelService.createChannel(ChannelsDtos);
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */
}
