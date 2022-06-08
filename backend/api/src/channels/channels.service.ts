import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "./channels.entity";
import { ChannelFilteDto } from "./dto/channels-filter.dto";
import { ChannelsDto } from "./dto/channels.dto";

function isChannel(id: string): boolean {
  const splited: string[] = id.split("-");
  return (
    id.length === 36 &&
    splited.length === 5 &&
    splited[0].length === 8 &&
    splited[1].length === 4 &&
    splited[2].length === 4 &&
    splited[3].length === 4 &&
    splited[4].length === 12
  );
}

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private ChannelsRepository: Repository<Channel>
  ) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */
  async getChannel(): Promise<Channel[]> {
    const users = await this.ChannelsRepository.find();
    if (!users) throw new NotFoundException(`Channel not found`);
    return users;
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
    if (isChannel(id))
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

  async createChannel(channelsDto: ChannelsDto): Promise<void> {
    const { name, status, permissions } = channelsDto;
    const channel = this.ChannelsRepository.create({
      name,
      status,
      permissions,
    });
    try {
      await this.ChannelsRepository.save(channel);
    } catch (error) {
      // 23505 = error code for duplicate username
      if (error.code == "23505") {
        throw new ConflictException("Channel already exist");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  /* **************************************************************************
\*/
  /*                   PATCH                                                    */
  /* ************************************************************************** */
}
