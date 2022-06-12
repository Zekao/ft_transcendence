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

  // @Column()
  // firstPlayer: User;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.matches)
  @JoinTable({ name: "player" })
  player: User[];
}
