import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  Inject,
  forwardRef,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { Socket } from "dgram";
import { isUuid } from "src/utils/utils";
import { Repository } from "typeorm";
import { Channel } from "./channels.entity";
import { ChannelsGateway } from "./channels.gateway";
import { ChannelFilteDto, ChannelMembersDto, ChannelStatusDto } from "./dto/channels-filter.dto";
import { ChannelPasswordDto, ChannelsDto } from "./dto/channels.dto";
import { User } from "src/users/users.entity";
import { ChannelStatus } from "./channels.enum";
import * as bcrypt from "bcrypt";

export class ChannelRelationsPicker {
  withAllMembers?: boolean;
  withMembersOnly?: boolean;
  withAdminOnly?: boolean;
  withOwnerOnly?: boolean;
  withMuted?: boolean;
  withBanned?: boolean;
}

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private ChannelsRepository: Repository<Channel>,
    private UsersService: UsersService
  ) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */
  async getChannel(StatusDto ?: ChannelStatusDto): Promise<Channel[]> {
    if (StatusDto)
      var { status } = StatusDto;
    var channels = await this.ChannelsRepository.find();
    if (!channels) throw new NotFoundException(`Channel not found`);
    if (status && status === ChannelStatus.PRIVATE)
      channels = channels.filter((channel) => channel.status === ChannelStatus.PRIVATE);
    else if (status && status === ChannelStatus.PUBLIC)
      channels = channels.filter((channel) => channel.status === ChannelStatus.PUBLIC);
    else if (status && status === ChannelStatus.PROTECTED)
      channels = channels.filter((channel) => channel.status === ChannelStatus.PROTECTED);
    return channels;
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
  async getChannelId(
    id: string,
    RelationsPicker?: ChannelRelationsPicker[]
  ): Promise<Channel> {
    const relations: string[] = [];
    if (RelationsPicker) {
      for (const relation of RelationsPicker) {
        relation.withAllMembers &&
          relations.push("members") &&
          relations.push("admins") &&
          relations.push("owner");
        relation.withMembersOnly && relations.push("members");
        relation.withAdminOnly && relations.push("admins");
        relation.withOwnerOnly && relations.push("owner");
        relation.withMuted && relations.push("muted");
        relation.withBanned && relations.push("banned");
      }
    }
    let found = null;
    if (isUuid(id))
      found = await this.ChannelsRepository.findOne({
        where: { id: id },
        relations,
      });
    else
      found = await this.ChannelsRepository.findOne({
        where: { name: id },
        relations,
      });
    if (!found) throw new NotFoundException(`Channel \`${id}' not found`);
    return found;
  }

  async getChannelMembers(channelId: string, Role?: ChannelMembersDto): Promise<User[]> {
    const { role, id } = Role;
    var relations : ChannelRelationsPicker[] = [];
    if (role) {
      if (role === "all") relations.push({ withAllMembers: true });
      if (role === "members") relations.push({ withMembersOnly: true });
      if (role === "admins") relations.push({ withAdminOnly: true });
      if (role === "owner") relations.push({ withOwnerOnly: true });
      if (role === "muted") relations.push({ withMuted: true });
      if (role === "banned") relations.push({ withBanned: true });
    } else {
      relations.push({ withAllMembers: true });
    }
    const channel = await this.getChannelId(channelId, relations);
    var users: User[] = [] ;
    if (channel.members){ 
      for (const member of channel.members)
        users.push(member);
    }
    if (channel.admins) {
      for (const admin of channel.admins)
        users.push(admin);
    }
    if (channel.owner) {
      users.push(channel.owner);
    }
    if (channel.mutedUsers) {
      for (const muted of channel.mutedUsers)
        users.push(muted);
    }
    if (channel.bannedUsers) {
      for (const banned of channel.bannedUsers)
        users.push(banned);
    }
    return users;
  }

  async getChannelHistory(
    id: string
  ): Promise<{ login: string; message: string }[]> {
    const found = await this.getChannelId(id);
    if (!found) throw new NotFoundException(`Channel \`${id}' not found`);
    return found.history;
  }
  async saveChannel(id: Channel): Promise<boolean> {
    this.ChannelsRepository.save(id);
    return true;
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  async createChannel(id:string, channelsDto: ChannelsDto): Promise<Channel> {
    const owner = await this.UsersService.getUserId(id);
    const { name, status, permissions, password } = channelsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const channel = this.ChannelsRepository.create({
      name,
      status,
      permissions,
      password: hashedPassword,
    });
    try {
      await this.ChannelsRepository.save(channel);
      channel.owner = owner;
      await this.ChannelsRepository.save(channel);
    } catch (error) {
      if (error.code == "23505") {
        throw new ConflictException("Channel already exist");
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
    return channel;
  }

  async validateChannelPassword(
    id: string,
    channelPasswordDto: ChannelPasswordDto
  ) {
    const found = await this.getChannelId(id);
    const { password } = channelPasswordDto;
    if (!(await bcrypt.compare(password, found.password)))
      throw new ForbiddenException("Incorrect Password");
    return found;
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */
  async deleteChannel(id: string): Promise<boolean> {
    const found = await this.getChannelId(id);
    if (!found) throw new NotFoundException(`Channel \`${id}' not found`);
    const target = await this.ChannelsRepository.delete(found.id);
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
