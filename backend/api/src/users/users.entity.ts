import { Column, Entity, PrimaryGeneratedColumn } from "node_modules/typeorm";
import { UserStatus } from "./users-status.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  first_name: string;
  @Column()
  last_name: string;
  @Column()
  user_name: string;
  @Column()
  email: string;
  @Column()
  status: UserStatus;
}
