import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
