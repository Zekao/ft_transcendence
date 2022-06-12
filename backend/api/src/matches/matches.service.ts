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

@Injectable()
export class MatchesService {
  constructor(
	@InjectRepository(Matches) private matchesRepository: Repository<Matches>,
  ) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */


  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */


  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */

 
}
