import {
  Controller,
  Param,
  Res,
  Query,
  Get,
  Post,
  Delete,
  Patch,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MatchesFilteDto } from "./dto/matches-filter.dto";
import { Matches } from "./matches.entity";
import { MatchesService } from "./matches.service";

@ApiTags("matches")
@Controller("matches")
export class MatchesController {
  constructor(private matchService: MatchesService) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  @Get()
  @ApiOperation({ summary: "Return list of all existing matches" })
  getMatches(@Query() filters: MatchesFilteDto): Promise<void> {
    // if (Object.keys(filters).length)
    // return this.matchService.getChannelByFilter(filters);
    // return this.matchService.getChannel();
    return;
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */
}
