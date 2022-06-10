import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { UserStatus, UserGameStatus } from "./users.enum";

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

  @ManyToMany(() => User , (user) => user.friends)
  @JoinTable({name : "friends"})
  friends: User[];

  @ManyToMany(() => User , (user) => user.blockedUsers)
  @JoinTable({name : "blockedUsers"})
  blockedUsers: User[];
}