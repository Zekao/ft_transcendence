import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "./channels.entity";
import { ChannelPermissions, ChannelStatus } from "./channels.enum";
import { ChannelsDto } from "./dto/channels.dto";

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private ChannelsRepository: Repository<Channel>
  ) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

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
