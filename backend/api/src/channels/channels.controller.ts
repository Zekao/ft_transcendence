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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Channel } from "./channels.entity";
import { ChannelsService } from "./channels.service";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelPasswordDto, ChannelsDto } from "./dto/channels.dto";

@ApiTags("channel")
@Controller("channel")
export class ChannelsController {
  constructor(private channelService: ChannelsService) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */
  @Get()
  @ApiOperation({ summary: "Return list of all existing channels" })
  getUsers(@Query() filters: ChannelFilteDto): Promise<Channel[]> {
    if (Object.keys(filters).length)
      return this.channelService.getChannelByFilter(filters);
    return this.channelService.getChannel();
  }
  @Get("/:id/status")
  @ApiOperation({
    summary: "Return the status of a specified channel",
  })
  getChannelStatus(@Param("id") id: string): Promise<string> {
    return this.channelService.getChannelStatus(id);
  }
  @Get("/:id/permission")
  @ApiOperation({
    summary: "Return the permission of a specified channel",
  })
  getChannelPermission(@Param("id") id: string): Promise<string> {
    return this.channelService.getChannelPermissions(id);
  }
  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @Post("/create")
  @ApiOperation({
    summary: "Create a new channel",
  })
  createChannel(
    @Body() ChannelsDtos: ChannelsDto,
    @Body() channelPasswordDto: ChannelPasswordDto
  ): Promise<Channel> {
    return this.channelService.createChannel(ChannelsDtos, channelPasswordDto);
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */
  @Delete("/:id/delete")
  @ApiOperation({
    summary: "Delete a specified channel",
  })
  deleteUser(@Param("id") id: string): Promise<boolean> {
    return this.channelService.deleteChannel(id);
  }

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */
  @Patch("/:id/edit")
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
