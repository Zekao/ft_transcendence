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

  @Column()
  first: string;

  @Column({ nullable: true })
  second: string;

  @Column("text", { array: true, nullable: true })
  history: { login: string; message: string }[];
}
