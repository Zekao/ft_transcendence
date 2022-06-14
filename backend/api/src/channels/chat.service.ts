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
import { User } from "src/users/users.entity";

@Injectable()
export class ChannelsService {
  constructor() {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  /* **************************************************************************
	/*
	/*                   PATCH                                                    */
  /* ************************************************************************** */
}
