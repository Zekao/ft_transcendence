import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  Res,
  Req,
} from "@nestjs/common";
import * as fs from "fs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Matches } from "./matches.entity";
import { ChannelFilteDto } from "../channels/dto/channels-filter.dto";

function isMatches(id: string): boolean {
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
export class MatchesService {
  constructor(
    @InjectRepository(Matches) private matchesRepository: Repository<Matches>
  ) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  async getMatches(): Promise<Matches[]> {
    const matches = await this.matchesRepository.find();
    if (!matches) throw new NotFoundException(`Matches not found`);
    return matches;
  }
  async getMatchesByFilter(filter: ChannelFilteDto): Promise<Matches[]> {
    const { name, permissions, status } = filter;
    const matches = await this.getMatches();
    // if (name) channels = channels.filter((channel) => channel.name === name);
    // if (status)
    //   channels = channels.filter((channel) => channel.status === status);
    // if (permissions)
    //   channels = channels.filter(
    //     (channel) => channel.permissions === permissions
    //   );
    // if (!channels) throw new NotFoundException(`Channel not found`);
    return matches;
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */
}
