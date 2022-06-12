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
import { MatchesFilteDto } from "./dto/matches-filter.dto";
import { MatchDto } from "./dto/matches.dto";
import { UsersService } from "../users/users.service";
import { User } from "../users/users.entity";
import { UserDto } from "../users/dto/user.dto";

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
    @InjectRepository(Matches) private matchesRepository: Repository<Matches>,
    private userService: UsersService
  ) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  async getMatches(): Promise<Matches[]> {
    const matches = await this.matchesRepository.find();
    if (!matches) throw new NotFoundException(`Matches not found`);
    return matches;
  }
  async getMatchesByFilter(filter: MatchesFilteDto): Promise<Matches[]> {
    const {
      FirstPlayer,
      SecondPlayer,
      scoreFirstPlayer,
      scoreSecondPlayer,
      winner,
    } = filter;
    let matches = await this.getMatches();
    if (FirstPlayer)
      matches = matches.filter(
        (channel) => channel.FirstPlayer === FirstPlayer
      );
    if (SecondPlayer)
      matches = matches.filter(
        (channel) => channel.SecondPlayer === SecondPlayer
      );
    if (scoreFirstPlayer)
      matches = matches.filter(
        (channel) => channel.scoreFirstPlayer === scoreFirstPlayer
      );
    if (scoreSecondPlayer)
      matches = matches.filter(
        (channel) => channel.scoreSecondPlayer === scoreSecondPlayer
      );
    if (winner)
      matches = matches.filter((channel) => channel.winner === winner);
    if (!matches) throw new NotFoundException(`Channel not found`);
    return matches;
  }
  async getMatchesId(id: string): Promise<Matches> {
    let found = null;
    if (isMatches(id))
      found = await this.matchesRepository.findOne({ where: { id: id } });
    if (!found) throw new NotFoundException(`Channel \`${id}' not found`);
    return found;
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  async createMatch(matchDto: MatchDto): Promise<Matches> {
    const { FirstPlayer, SecondPlayer, scoreFirstPlayer, scoreSecondPlayer } =
      matchDto;
    const match = this.matchesRepository.create({
      FirstPlayer,
      SecondPlayer,
      scoreFirstPlayer,
      scoreSecondPlayer,
    });
    try {
      await this.matchesRepository.save(match);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    return match;
  }

  async addPlayerToMatch(id: string, match_id: string): Promise<Matches> {
    const found = await this.userService.getUserId(id, { myMatches: true });
    const match = await this.getMatchesId(match_id);
    if (!found.matches) found.matches = [];
    found.matches.push(match);
    await this.userService.saveUser(found);
    return match;
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  async deleteMatch(id: string): Promise<boolean> {
    const found = await this.getMatchesId(id);
    if (!found) throw new NotFoundException(`Match \`${id}' not found`);
    const target = await this.matchesRepository.delete(found);
    if (target.affected === 0)
      throw new NotFoundException(`Match \`${id}' not found`);
    return true;
  }

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */

  async editMatch(id: string, matchDto: MatchDto): Promise<Matches> {
    const {
      FirstPlayer,
      SecondPlayer,
      scoreFirstPlayer,
      scoreSecondPlayer,
      winner,
    } = matchDto;
    const found = await this.getMatchesId(id);
    if (FirstPlayer) found.FirstPlayer = FirstPlayer;
    if (SecondPlayer) found.SecondPlayer = SecondPlayer;
    if (scoreFirstPlayer) found.scoreFirstPlayer = scoreFirstPlayer;
    if (scoreSecondPlayer) found.scoreSecondPlayer = scoreSecondPlayer;
    if (winner) found.winner = winner;
    this.matchesRepository.save(found);
    return found;
  }
}
