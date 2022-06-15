import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/users/dto/user.dto";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../users/users.entity";
import { MatchStatus } from "./matchs.enum";

@Entity()
export class Matchs {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ type: () => User })
  @ManyToMany(() => User, (user) => user.matchs)
  @JoinTable({ name: "firstPlayer" })
  FirstPlayer: User;

  @ApiProperty({ type: () => User })
  @ManyToMany(() => User, (user) => user.matchs, { nullable: true })
  @JoinTable({ name: "secondPlayer" })
  SecondPlayer: User;

  @Column({ nullable: true })
  scoreFirstPlayer: number;

  @Column({ nullable: true })
  scoreSecondPlayer: number;

  @Column({ nullable: true })
  posFirstPlayer: number;

  @Column({ nullable: true })
  posSecondPlayer: number;

  @OneToMany(() => User, (user) => user.matchs, { nullable: true })
  winner: User;

  @Column()
  status: MatchStatus;

  @ApiProperty({ type: () => User })
  @ManyToMany(() => User, (user) => user.matchs)
  @JoinTable({ name: "Spectators" })
  specs: User[];
}
