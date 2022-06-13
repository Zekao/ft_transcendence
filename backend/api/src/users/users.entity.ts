import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Matches } from "../matches/matches.entity";
import { UserStatus, UserGameStatus } from "./users.enum";

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @ApiProperty()
  @Column()
  FortyTwoID: number;
  @ApiProperty()
  @Column()
  first_name: string;
  @ApiProperty()
  @Column()
  last_name: string;
  @ApiProperty()
  @Column({ unique: true })
  user_name: string;
  @ApiProperty()
  @Column({ nullable: true, unique: true })
  display_name: string;
  @ApiProperty()
  @Column()
  email: string;
  @ApiProperty()
  @Column()
  avatar: string;
  @ApiProperty()
  @Column()
  TwoFA: boolean;
  @ApiProperty()
  @Column()
  status: UserStatus;
  @ApiProperty()
  @Column()
  in_game: UserGameStatus;
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
  @ManyToMany(() => Matches, (matches) => matches.player)
  @JoinTable({ name: "MatchHistory" })
  matches: Matches[];

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable({ name: "friends" })
  friends: User[];

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.blockedUsers)
  @JoinTable({ name: "blockedUsers" })
  blockedUsers: User[];
}
