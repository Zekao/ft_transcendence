import { User } from "src/users/users.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from "typeorm";
import { ChannelPermissions, ChannelStatus } from "./channels.enum";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Channel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
  @Column({ unique: true })
  name: string;
  @Column()
  status: ChannelStatus;
  @Column()
  permissions: ChannelPermissions;
  @Column({ nullable: true })
  password: string;
}
