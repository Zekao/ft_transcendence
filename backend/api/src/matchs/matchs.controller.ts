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
import { MatchsFilteDto } from "./dto/matchs-filter.dto";
import { Matchs } from "./matchs.entity";
import { MatchsService } from "./matchs.service";
import { MatchDto } from "./dto/matchs.dto";
import { JwtAuthGuard } from "../auth/guard/jwt.auth.guard";

@ApiTags("matches")
@Controller("matches")
export class MatchsController {
  constructor(private matchService: MatchsService) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  @Get()
  @ApiOperation({ summary: "Return list of all existing matches" })
  getMatchs(@Query() filters: MatchsFilteDto): Promise<Matchs[]> {
    if (Object.keys(filters).length)
      return this.matchService.getMatchsByFilter(filters);
    return this.matchService.getMatchs();
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  @UseGuards(JwtAuthGuard)
  @Post("/create")
  @ApiOperation({
    summary: "Create a new match",
  })
  createMatch(@Request() req): Promise<Matchs> {
    return this.matchService.createMatch(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/join")
  @ApiOperation({
    summary: "Join a match",
  })
  addUserToMatchMatch(@Request() req): Promise<Matchs> {
    const user = req.user;
    return this.matchService.defineMatch(user);
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
  ): Promise<Matchs> {
    return this.matchService.editMatch(id, edit);
  }
}
