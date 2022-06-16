import { ApiProperty } from "@nestjs/swagger";
import { Channel } from "src/channels/channels.entity";
import { ChannelsDto } from "src/channels/dto/channels.dto";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { QRObjects } from "../auth/dto/2fa.dto";
import { Matchs } from "../matchs/matchs.entity";
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
  @Column({ unique: true })
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
  First_time: boolean;
  @ApiProperty()
  @Column({ nullable: true })
  TwoFAVerify: string;
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

  @ApiProperty({ type: () => Matchs })
  @OneToMany(
    () => Matchs,
    (matchs) => matchs.FirstPlayer || matchs.SecondPlayer
  )
  @JoinTable({ name: "MatchHistory" })
  matchs: Matchs[];

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable({ name: "friends" })
  friends: User[];

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.blockedUsers)
  @JoinTable({ name: "blockedUsers" })
  blockedUsers: User[];

  @ApiProperty()
  @ManyToMany(() => Channel, (channel) => channel.members, { nullable: true })
  @JoinTable({ name: "joinedChannels" })
  joined_channels: Channel[];

  @ApiProperty()
  @ManyToMany(() => Channel, (channel) => channel.admins, { nullable: true })
  @JoinTable({ name: "adminedChannels" })
  admined_channels: Channel[];

  @ManyToOne(() => Channel, (channel) => channel.owner, { nullable: true })
  @ApiProperty({ type: () => Channel })
  @JoinTable({ name: "owneredChannels" })
  ownered_channels: ChannelsDto[];

  @ManyToMany(() => Channel, (channel) => channel.mutedUsers, {
    nullable: true,
  })
  @ApiProperty({ type: () => Channel })
  @JoinTable({ name: "mutedChannels" })
  mutedChannels: Channel[];

  @ManyToMany(() => Channel, (channel) => channel.bannedUsers, {
    nullable: true,
  })
  @ApiProperty({ type: () => Channel })
  @JoinTable({ name: "bannedChannels" })
  bannedChannels: Channel[];
}
