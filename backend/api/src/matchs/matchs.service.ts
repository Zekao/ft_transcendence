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
import { Matchs } from "./matchs.entity";
import { ChannelFilteDto } from "../channels/dto/channels-filter.dto";
import { MatchsFilteDto } from "./dto/matchs-filter.dto";
import { MatchDto } from "./dto/matchs.dto";
import { UsersService } from "../users/users.service";
import { User } from "../users/users.entity";
import { UserDto } from "../users/dto/user.dto";
import { MatchStatus } from "./matchs.enum";

function isMatchs(id: string): boolean {
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
export class MatchsService {
  constructor(
    @InjectRepository(Matchs) private matchsRepository: Repository<Matchs>,
    private userService: UsersService
  ) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  async getMatchs(): Promise<Matchs[]> {
    const matchs = await this.matchsRepository.find();
    if (!matchs) throw new NotFoundException(`Matchs not found`);
    return matchs;
  }
  async getMatchsByFilter(filter: MatchsFilteDto): Promise<Matchs[]> {
    const {
      FirstPlayer,
      SecondPlayer,
      scoreFirstPlayer,
      scoreSecondPlayer,
      winner,
      status,
    } = filter;
    let matchs = await this.getMatchs();
    if (FirstPlayer)
      matchs = matchs.filter(
        (matchs) => matchs.FirstPlayer === FirstPlayer
      );
    if (SecondPlayer)
      matchs = matchs.filter(
        (matchs) => matchs.SecondPlayer === SecondPlayer
      );
    if (scoreFirstPlayer)
      matchs = matchs.filter(
        (matchs) => matchs.scoreFirstPlayer === scoreFirstPlayer
      );
    if (scoreSecondPlayer)
      matchs = matchs.filter(
        (matchs) => matchs.scoreSecondPlayer === scoreSecondPlayer
      );
    if (status)
      matchs = matchs.filter((channel) => channel.status === status);
    if (winner)
      matchs = matchs.filter((channel) => channel.winner === winner);
    if (!matchs) throw new NotFoundException(`Channel not found`);
    return matchs;
  }
  async getMatchsId(id: string): Promise<Matchs> {
    let found = null;
    if (isMatchs(id))
      found = await this.matchsRepository.findOne({ where: { id: id } });
    if (!found) throw new NotFoundException(`Channel \`${id}' not found`);
    return found;
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  async createMatch(id: string): Promise<Matchs> {
    const user = await this.userService.getUserId(id, [{withMatchs: true}]);
    if (user.matchs.find((m) => m.status === MatchStatus.PENDING || m.status === MatchStatus.STARTED))
      throw new ConflictException("You already have a match in progress");
    const match = this.matchsRepository.create({
      FirstPlayer: user,
    });
    try {
      match.status = MatchStatus.PENDING;
      match.specs = [];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    await this.matchsRepository.save(match);
    return match;
  }

  async addMatchToPlayer(player: User, match: Matchs): Promise<Matchs> {
    if (!player.matchs) player.matchs = [];
    player.matchs.push(match);
    await this.userService.saveUser(player);
    return match;
  }

  async addPlayerToMatch(player: User, match: Matchs): Promise<Matchs> {
    if (!match.SecondPlayer) match.SecondPlayer = player;
    else throw new UnauthorizedException("Match is full");
    if (match.FirstPlayer == player)
      throw new NotFoundException("Cannot join same match");
    this.matchsRepository.save(match);
    return match;
  }

  async findMatch(): Promise<Matchs> {
    let Allmatchs = await this.getMatchs();
    if (!Allmatchs.length)
      throw new NotFoundException("No match are available");
    Allmatchs = Allmatchs.filter(
      (Allmatchs) => Allmatchs.status === MatchStatus.PENDING
    );
    if (!Allmatchs) throw new NotFoundException("No match are available");
    return Allmatchs.at(0);
  }

  async defineMatch(player: User): Promise<Matchs> {
    let match = null;
    try {
      match = await this.findMatch();
      await this.addPlayerToMatch(player, match);
      await this.addMatchToPlayer(player, match);
      match.status = MatchStatus.STARTED;
      this.matchsRepository.save(match);
    } catch (err) {
      return err;
    }
    return match;
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  async deleteMatch(id: string): Promise<boolean> {
    const found = await this.getMatchsId(id);
    if (!found) throw new NotFoundException(`Match \`${id}' not found`);
    const target = await this.matchsRepository.delete(found);
    if (target.affected === 0)
      throw new NotFoundException(`Match \`${id}' not found`);
    return true;
  }

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */

  async editMatch(id: string, matchDto: MatchDto): Promise<Matchs> {
    const {
      FirstPlayer,
      SecondPlayer,
      scoreFirstPlayer,
      scoreSecondPlayer,
      winner,
    } = matchDto;
    const found = await this.getMatchsId(id);
    if (FirstPlayer) found.FirstPlayer = FirstPlayer;
    if (SecondPlayer) found.SecondPlayer = SecondPlayer;
    if (scoreFirstPlayer) found.scoreFirstPlayer = scoreFirstPlayer;
    if (scoreSecondPlayer) found.scoreSecondPlayer = scoreSecondPlayer;
    if (winner) found.winner = winner;
    this.matchsRepository.save(found);
    return found;
  }
}