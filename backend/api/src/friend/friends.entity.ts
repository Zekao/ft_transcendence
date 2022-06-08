import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { FriendPermissions, FriendStatus } from "./friends.enum";

@Entity()
export class Friend {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;
  @Column()
  status: FriendStatus;
  @Column()
  permissions: FriendPermissions;
}
