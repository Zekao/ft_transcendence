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
<<<<<<< HEAD
  
  @ManyToMany(() => User, (user) => user.joined_channels, { nullable: true })
=======

  @ManyToMany(() => User)
>>>>>>> 6dafdb94322175c3d62f8855914b0b432e19024b
  @JoinTable()
  members: User[];

  @ManyToMany(() => User, (user) => user.admined_channels, { nullable: true })
  admins: User[];

  @OneToMany(() => User, (user) => user.ownered_channels)
  @ApiProperty({ type: () => User })
  owner: UserDto;
}
