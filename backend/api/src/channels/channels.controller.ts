import { Body, Controller, Post } from "@nestjs/common";
import { ChannelPermissions, ChannelStatus } from "./channels.enum";

import { ChannelsService } from "./channels.service";
import { ChannelsDto } from "./dto/channels.dto";

@Controller("channel")
export class ChannelsController {
  constructor(private ChannelService: ChannelsService) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @Post("/create")
  createChannel(@Body() ChannelsDtos: ChannelsDto): Promise<void> {
    return this.ChannelService.createChannel(ChannelsDtos);
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */
}
