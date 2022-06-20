import {
  Controller,
  Param,
  Query,
  Get,
  Delete,
  Patch,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MatchsFilteDto } from "./dto/matchs-filter.dto";
import { Matchs } from "./matchs.entity";
import { MatchsService } from "./matchs.service";
import { MatchDto } from "./dto/matchs.dto";
import { JwtAuthGuard } from "../auth/guard/jwt.auth.guard";

@ApiTags("matchs")
@Controller("matchs")
export class MatchsController {
  constructor(private matchService: MatchsService) {}

  /* ************************************************************************** */
  /*                   GET                                                      */
  /* ************************************************************************** */

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Return list of all existing matchs" })
  getMatchs(@Query() filters: MatchsFilteDto): Promise<Matchs[]> {
    if (Object.keys(filters).length)
      return this.matchService.getMatchsByFilter(filters);
    return this.matchService.getMatchs();
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Return a match by id" })
  getMatchsId(@Param("id") id: string, @Request() req): Promise<Matchs> {
    return this.matchService.getMatchsId(id, [{ withUsers: true }]);
  }

  /* ************************************************************************** */
  /*                   POST                                                     */
  /* ************************************************************************** */

  /* ************************************************************************** */
  /*                   DELETE                                                   */
  /* ************************************************************************** */

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Delete the specified matchs",
  })
  deleteUser(@Param("id") id: string): Promise<boolean> {
    return this.matchService.deleteMatch(id);
  }

  /* ************************************************************************** */
  /*                   PATCH                                                    */
  /* ************************************************************************** */

  @Patch("/:id/edit")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Modify attribute of a specified matchs",
  })
  editChannel(
    @Param("id") id: string,
    @Query() edit: MatchDto
  ): Promise<Matchs> {
    return this.matchService.editMatch(id, edit);
  }
}
