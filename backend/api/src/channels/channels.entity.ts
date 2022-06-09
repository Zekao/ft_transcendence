import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ChannelPermissions, ChannelStatus } from "./channels.enum";

@Entity()
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
}
