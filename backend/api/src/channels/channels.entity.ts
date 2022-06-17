import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/users.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @ManyToMany(() => User, { nullable: true })
  @JoinTable({ name: "members" })
  members: User[];

  @ManyToMany(() => User, { nullable: true })
  @JoinTable({ name: "admins" })
  admins: User[];

  @ManyToOne(() => User, { nullable: false })
  @ApiProperty({ type: () => User })
  @JoinTable({ name: "owner" })
  owner: User;

  @ManyToMany(() => User, { nullable: true })
  @ApiProperty({ type: () => User })
  @JoinTable({ name: "mutedUsers" })
  mutedUsers: User[];

  @ManyToMany(() => User, { nullable: true })
  @ApiProperty({ type: () => User })
  @JoinTable({ name: "bannedUsers" })
  bannedUsers: User[];
}
