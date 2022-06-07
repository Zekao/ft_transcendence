import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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
  email: string;
  @Column()
  status: UserStatus;
  @Column({ nullable: true })
  in_game: UserGameStatus;
  @Column({ nullable: true })
  win: number;
  @Column({ nullable: true })
  loose: number;
  @Column({ nullable: true })
  rank: number;
}
