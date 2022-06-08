import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { UserStatus, UserGameStatus } from "./users-status.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  first_name: string;
  @Column()
  last_name: string;
  @Column({ unique: true })
  user_name: string;
  @Column()
  password: string;
  @Column()
  email: string;
  @Column({ nullable: true })
  avatar: string;
  @Column()
  status: UserStatus;
  @Column()
  in_game: UserGameStatus;
  @Column()
  win: number;
  @Column()
  loose: number;
  @Column()
  rank: number;
  @Column({ type: "real" })
  ratio: number;
  @ManyToMany(() => User, (user) => user.id, {
    cascade: true,
  })
  @JoinTable()
  friend: User[];
}
