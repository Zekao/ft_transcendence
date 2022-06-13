import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { Socket } from "dgram";
import { isUuid } from "src/utils/utils";
import { Repository } from "typeorm";
import { Channel } from "./channels.entity";
import { ChannelsGateway } from "./channels.gateway";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelPasswordDto, ChannelsDto } from "./dto/channels.dto";

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private ChannelsRepository: Repository<Channel>,
    private UsersService: UsersService,
  ) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */
  async getChannel(): Promise<Channel[]> {
    const channel = await this.ChannelsRepository.find();
    if (!channel) throw new NotFoundException(`Channel not found`);
    return channel;
  }
  async getChannelByFilter(filter: ChannelFilteDto): Promise<Channel[]> {
    const { name, permissions, status } = filter;
    let channels = await this.getChannel();
    if (name) channels = channels.filter((channel) => channel.name === name);
    if (status)
      channels = channels.filter((channel) => channel.status === status);
    if (permissions)
      channels = channels.filter(
        (channel) => channel.permissions === permissions
      );
    if (!channels) throw new NotFoundException(`Channel not found`);
    return channels;
  }
  async getChannelId(id: string): Promise<Channel> {
    let found = null;
    if (isUuid(id))
      found = await this.ChannelsRepository.findOne({ where: { id: id } });
    else found = await this.ChannelsRepository.findOne({ where: { name: id } });
    if (!found) throw new NotFoundException(`Channel \`${id}' not found`);
    return found;
  }
  async getChannelPermissions(id: string): Promise<string> {
    const found = await this.getChannelId(id);
    if (!found) throw new NotFoundException(`Channel \`${id}' not found`);
    return found.permissions;
  }
  async getChannelStatus(id: string): Promise<string> {
    const found = await this.getChannelId(id);
    if (!found) throw new NotFoundException(`Channel \`${id}' not found`);
    return found.status;
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  async createChannel(
    channelsDto: ChannelsDto,
    channelPasswordDto: ChannelPasswordDto
  ): Promise<Channel> {
    const { name, status, permissions } = channelsDto;
    const { password } = channelPasswordDto;
    const channel = this.ChannelsRepository.create({
      name,
      status,
      permissions,
      password,
    });
    try {
      await this.ChannelsRepository.save(channel);
    } catch (error) {
      // 23505 = error code for duplicate username
      if (error.code == "23505") {
        throw new ConflictException("Channel already exist");
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
    return channel;
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */
  async deleteChannel(id: string): Promise<boolean> {
    const found = await this.getChannelId(id);
    if (!found) throw new NotFoundException(`Channel \`${id}' not found`);
    const target = await this.ChannelsRepository.delete(found);
    if (target.affected === 0)
      throw new NotFoundException(`Channel \`${id}' not found`);
    return true;
  }

  /* **************************************************************************
  /*
  /*                   PATCH                                                    */
  /* ************************************************************************** */
  async editChannel(id: string, ChannelDto: ChannelsDto): Promise<Channel> {
    const { name, status, permissions } = ChannelDto;
    const found = await this.getChannelId(id);
    if (name) found.name = name;
    if (status) found.status = status;
    if (permissions) found.permissions = permissions;
    await this.ChannelsRepository.save(found);
    return found;
  }
}
