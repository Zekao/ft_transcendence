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
  @ApiProperty()
  @Column()
  in_game: gameStatus;
  @ApiProperty()
  @Column()
  win: number;
  @ApiProperty()
  @Column()
  loose: number;
  @ApiProperty()
  @Column()
  rank: number;
  @ApiProperty()
  @Column({ type: "real" })
  ratio: number;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.matches)
  @JoinTable({ name: "Matches" })
  users: Matches[];
}
