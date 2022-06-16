import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/users/dto/user.dto";
import { User } from "src/users/users.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from "typeorm";
import { ChannelPermissions, ChannelStatus } from "./channels.enum";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Channel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;
  @Column()
  status: ChannelStatus;
  @Column()
  permissions: ChannelPermissions;
  @Column({ nullable: true })
  password: string;

  @Column("text", { array: true, nullable: true })
  history: { login: string; message: string }[];

  @ManyToMany(() => User, (user) => user.joinedChannels, { nullable: true })
  @JoinTable({ name: 'members' })
  members: User[];

  @ManyToMany(() => User, (user) => user.adminedChannels, { nullable: true })
  @JoinTable({ name: "admins" })
  admins: User[];

  @ManyToOne(() => User, (user) => user.ownedChannels, { nullable: false})
  @ApiProperty({ type: () => User })
  @JoinTable({ name: "owner" })
  owner: User;

  @OneToMany(() => User, (user) => user.mutedChannels, { nullable: true })
  @ApiProperty({ type: () => User })
  @JoinTable({ name: "muted" })
  mutedUsers: User[];

  @OneToMany(() => User, (user) => user.bannedChannels, { nullable: true })
  @ApiProperty({ type: () => User })
  @JoinTable({ name: "banned" })
  bannedUsers: User[];
}
