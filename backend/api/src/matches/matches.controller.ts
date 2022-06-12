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
  Body,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MatchesFilteDto } from "./dto/matches-filter.dto";
import { Matches } from "./matches.entity";
import { MatchesService } from "./matches.service";
import { MatchDto } from "./dto/matches.dto";
import { JwtAuthGuard } from "../auth/guard/jwt.auth.guard";

@ApiTags("matches")
@Controller("matches")
export class MatchesController {
  constructor(private matchService: MatchesService) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  @Get()
  @ApiOperation({ summary: "Return list of all existing matches" })
  getMatches(@Query() filters: MatchesFilteDto): Promise<Matches[]> {
    if (Object.keys(filters).length)
      return this.matchService.getMatchesByFilter(filters);
    return this.matchService.getMatches();
    return;
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @Post("/create")
  @ApiOperation({
    summary: "Create a new match",
  })
  createChannel(@Body() matchesDto: MatchDto): Promise<Matches> {
    return this.matchService.createMatch(matchesDto);
  }

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  @Delete("/:id")
  @ApiOperation({
    summary: "Delete the specified matches",
  })
  deleteUser(@Param("id") id: string): Promise<boolean> {
    return this.matchService.deleteMatch(id);
  }

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */

  @Patch("/:id/edit")
  @ApiOperation({
    summary: "Modify attribute of a specified matches",
  })
  editChannel(
    @Param("id") id: string,
    @Query() edit: MatchDto
  ): Promise<Matches> {
    return this.matchService.editMatch(id, edit);
  }
}
