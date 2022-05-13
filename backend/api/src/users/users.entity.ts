import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    first_name: string;
    @Column()
    last_name: string;
    @Column()
    nick_name: string;
    @Column()
    email: string;
    @Column()
    password: string;

}