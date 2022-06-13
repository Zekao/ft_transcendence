import { User } from "src/users/users.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @ManyToMany(() => User, (user) => user.admined_channels)
  admins: User[];

  @OneToMany(() => User, (user) => user.ownered_channel)
  owner: User;
}
