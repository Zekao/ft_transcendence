import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../users/users.entity";
import { gameStatus } from "./matches.enum";

@Entity()
export class Matches {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  FirstPlayer: string;

  @Column()
  SecondPlayer: string;

  @Column({ nullable: true })
  scoreFirstPlayer: number;

  @Column({ nullable: true })
  scoreSecondPlayer: number;

  @Column({ nullable: true })
  winner: string;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.matches)
  @JoinTable({ name: "PlayerInTheMatch" })
  player: User[];
}
