import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../users/users.entity";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(() => User, (user) => user.privateMessage, { nullable: true })
  @JoinTable()
  participants: User[];

  @Column("text", { array: true, nullable: true })
  history: { login: string; message: string }[];
}
