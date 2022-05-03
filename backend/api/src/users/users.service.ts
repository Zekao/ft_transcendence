import { Injectable } from '@nestjs/common';
import { User, UserStatus } from './users.model';
import { v4 as uuid } from 'uuid';
import { stringify } from 'querystring';
import { createUserDTO } from './dto/create-user.dto';

function setNickName(users : User[], first : string, last : string) : string{
    let nick : string;
    let first_size : number = 1;
    let cond: boolean = false;
    while (!cond) {
        cond = true;
        nick = `${first.slice(0, first_size)}${last}`;
        for (let i = 0; i < users.length; i++) {
            if (users[i].nick_name === nick) {
                first_size++;
                cond = false;
            }
            continue;
        }
    }
    return nick;
}

@Injectable()
export class UsersService {
    private users : User[] = [];

/*
 *      Get
 */
    getUsers() : User[] {return this.users;}

    getUserId(id : string) : User {
        return this.users.find((user) => user.id === id);
    }

/*
 *      POST
 */
    createUser(createUser : createUserDTO) : User {
        const { first_name, last_name } = createUser;
        const user : User = {
            id : uuid(),
            first_name,
            last_name,
            nick_name: setNickName(this.users, first_name, last_name),
            status : UserStatus.ACTIVE,
        };
        this.users.push(user);
        return user;
    }

}
