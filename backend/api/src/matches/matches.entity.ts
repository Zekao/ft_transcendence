import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../users/users.entity";
import { MatchStatus } from "./matches.enum";

@Entity()
export class Matches {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  FirstPlayer: string;

  @Column({ nullable: true })
  SecondPlayer: string;

  @Column({ nullable: true })
  scoreFirstPlayer: number;

  @Column({ nullable: true })
  scoreSecondPlayer: number;

  @Column({ nullable: true })
  winner: string;

  @Column()
  MatchStatus: MatchStatus;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.matches)
  @JoinTable({ name: "PlayerInTheMatch" })
  player: User[];
}
