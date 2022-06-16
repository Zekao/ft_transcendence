import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/users/dto/user.dto";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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
  @ManyToOne(() => User, (user) => user.matchs)
  @JoinTable({ name: "firstPlayer" })
  FirstPlayer: User;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.matchs, { nullable: true })
  @JoinTable({ name: "secondPlayer" })
  SecondPlayer: User;

  @Column()
  scoreFirstPlayer: number;

  @Column()
  scoreSecondPlayer: number;

  @Column()
  posFirstPlayer: number;

  @Column()
  posSecondPlayer: number;

  @Column()
  posBallx: number;

  @Column()
  posBally: number;

  @Column({ type: "real" })
  direction: number;

  @OneToMany(() => User, (user) => user.matchs, { nullable: true })
  winner: User;

  @Column()
  status: MatchStatus;

  @ApiProperty({ type: () => User })
  @ManyToMany(() => User, (user) => user.matchs)
  @JoinTable({ name: "Spectators" })
  specs: User[];
}
