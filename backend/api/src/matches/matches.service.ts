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
import { MatchStatus } from "./matches.enum";

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
      status,
    } = filter;
    let matches = await this.getMatches();
    if (FirstPlayer)
      matches = matches.filter(
        (matches) => matches.FirstPlayer === FirstPlayer
      );
    if (SecondPlayer)
      matches = matches.filter(
        (matches) => matches.SecondPlayer === SecondPlayer
      );
    if (scoreFirstPlayer)
      matches = matches.filter(
        (matches) => matches.scoreFirstPlayer === scoreFirstPlayer
      );
    if (scoreSecondPlayer)
      matches = matches.filter(
        (matches) => matches.scoreSecondPlayer === scoreSecondPlayer
      );
    if (status)
      matches = matches.filter((channel) => channel.status === status);
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

  async createMatch(user: User): Promise<Matches> {
    const match = this.matchesRepository.create({
      FirstPlayer: user.id,
    });
    try {
      match.status = MatchStatus.PENDING;
      await this.matchesRepository.save(match);
      match.player = [];
      match.player.push(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    return match;
  }

  async addMatchToPlayer(player: User, match: Matches): Promise<Matches> {
    if (!player.matches) player.matches = [];
    player.matches.push(match);
    await this.userService.saveUser(player);
    return match;
  }

  async addPlayerToMatch(player: User, match: Matches): Promise<Matches> {
    if (!match.SecondPlayer) match.SecondPlayer = player.id;
    else throw new UnauthorizedException("Match is full");
    if (match.FirstPlayer == player.id)
      throw new NotFoundException("Cannot join same match");
    this.matchesRepository.save(match);
    return match;
  }

  async findMatch(): Promise<Matches> {
    let Allmatches = await this.getMatches();
    if (!Allmatches.length)
      throw new NotFoundException("No match are available");
    Allmatches = Allmatches.filter(
      (Allmatches) => Allmatches.status === MatchStatus.PENDING
    );
    if (!Allmatches) throw new NotFoundException("No match are available");
    return Allmatches.at(0);
  }

  async defineMatch(player: User): Promise<Matches> {
    let match = null;
    try {
      match = await this.findMatch();
      await this.addPlayerToMatch(player, match);
      await this.addMatchToPlayer(player, match);
      match.status = MatchStatus.STARTED;
      this.matchesRepository.save(match);
    } catch (err) {
      return err;
    }
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
