import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  Res,
  Req,
  Inject,
  forwardRef,
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

export class MatchsRelationPicker {
  withUsers?: boolean;
}

@Injectable()
export class MatchsService {
  constructor(
    @InjectRepository(Matchs) private MatchsRepository: Repository<Matchs>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService
  ) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  async getMatchs(): Promise<Matchs[]> {
    const matchs = await this.MatchsRepository.find();
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
      matchs = matchs.filter((matchs) => matchs.FirstPlayer === FirstPlayer);
    if (SecondPlayer)
      matchs = matchs.filter((matchs) => matchs.SecondPlayer === SecondPlayer);
    if (scoreFirstPlayer)
      matchs = matchs.filter(
        (matchs) => matchs.scoreFirstPlayer === scoreFirstPlayer
      );
    if (scoreSecondPlayer)
      matchs = matchs.filter(
        (matchs) => matchs.scoreSecondPlayer === scoreSecondPlayer
      );
    if (status) matchs = matchs.filter((channel) => channel.status === status);
    if (winner) matchs = matchs.filter((channel) => channel.winner === winner);
    if (!matchs) throw new NotFoundException(`Channel not found`);
    return matchs;
  }

  async getMatchsId(
    id: any,
    RelationsPicker?: MatchsRelationPicker[]
  ): Promise<Matchs> {
    const relations = [];
    if (RelationsPicker) {
      for (const relation of RelationsPicker) {
        relation.withUsers &&
          relations.push("FirstPlayer") &&
          relations.push("SecondPlayer");
      }
    }
    let found: Matchs = null;
    if (isMatchs(id))
      found = await this.MatchsRepository.findOne({
        where: { id: id },
        relations,
      });
    if (!found) throw new NotFoundException(`Channel \`${id}' not found`);
    return found;
  }

  async getPosFirstPlayer(id: Matchs): Promise<number> {
    return id.posFirstPlayer;
  }

  async getPosSecondPlayer(id: Matchs): Promise<number> {
    return id.posSecondPlayer;
  }

  async setPosFirstPlayer(id: Matchs, pos: number): Promise<boolean> {
    id.posFirstPlayer = pos;
    this.MatchsRepository.save(id);
    return true;
  }

  async setPosSecondPlayer(id: Matchs, pos: number): Promise<boolean> {
    id.posSecondPlayer = pos;
    this.MatchsRepository.save(id);
    return true;
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  async createMatch(id: string): Promise<Matchs> {
    const user = await this.userService.getUserId(id, [{ withMatchs: true }]);
    const matchPending = user.matchs.find(
      (m) =>
        m.status === MatchStatus.PENDING || m.status === MatchStatus.STARTED
    );
    if (matchPending)
      throw new ConflictException(
        `You already have a match in progress: \`${matchPending.id}\``
      );
    const match = this.MatchsRepository.create({
      scoreFirstPlayer: 0,
      scoreSecondPlayer: 0,
      posFirstPlayer: 0,
      posSecondPlayer: 0,
      status: MatchStatus.PENDING,
      specs: [],
    });
    await this.MatchsRepository.save(match);
    match.FirstPlayer = user;
    await this.MatchsRepository.save(match);
    return match;
  }

  async addPlayerToMatch(player: User, match: Matchs): Promise<Matchs> {
    if (!match.SecondPlayer) match.SecondPlayer = player;
    else throw new UnauthorizedException("Match is full");
    if (match.FirstPlayer == player)
      throw new NotFoundException("Cannot join same match");
    this.MatchsRepository.save(match);
    return match;
  }

  async findMatch(): Promise<Matchs[]> {
    let Allmatchs = await this.getMatchs();
    if (!Allmatchs.length)
      throw new NotFoundException("No match are available");
    Allmatchs = Allmatchs.filter(
      (Allmatchs) => Allmatchs.status === MatchStatus.PENDING
    );
    if (!Allmatchs) throw new NotFoundException("No match are available");
    return Allmatchs;
  }

  async defineMatch(player: User): Promise<Matchs> {
    let match = null;
    try {
      match = await this.findMatch();
      match.array.forEach((element) => {
        if (element.id) {
          console.log(element.id);
        }
      });
      await this.addPlayerToMatch(player, match);
      match.status = MatchStatus.STARTED;
      this.MatchsRepository.save(match);
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
    const target = await this.MatchsRepository.delete(found.id);
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
    this.MatchsRepository.save(found);
    return found;
  }
}
