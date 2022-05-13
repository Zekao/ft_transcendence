import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserStatus } from './users.model';
import { v4 as uuid } from 'uuid';
import { createUserDTO } from './dto/create-user.dto';
import { UsersFiltesDTO } from './dto/user-filter.dto';

function setNickName(users : User[], first : string, last : string) : string{
    let nick : string;
    let first_size : number = 1;
    let cond: boolean = false;
    while (!cond) {
        cond = true;
        nick = `${first.slice(0, first_size)}${last}`;
        for (let i = 0; i < users.length; i++) {
            if (users[i].nick_name === nick) {
                if (first_size < first.length)
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

/* ************************************************************************** */
/*                   GET                                                      */
/* ************************************************************************** */
    getUsers() : User[] {return this.users;}

    getUserByFilter(filter : UsersFiltesDTO) : User[] {
        const { status, search } = filter;
        let users = this.getUsers();
        if (status) users = users.filter((user) => user.status === status);
        if (search) users = users.filter((user) => {
            if (user.id.includes(search)) return true;
            if (user.first_name.includes(search)) return true;
            if (user.last_name.includes(search)) return true;
            if (user.nick_name.includes(search)) return true;
            if (user.email.includes(search)) return true;
        })
        return users;
    }

    getUserId(id : string) : User {
        const found = this.users.find((user) => user.id === id);
        if (!found)
            throw new NotFoundException(`User \`${id}' not found`);
        return found;
    }

    getUserStatus(id : string) : UserStatus {return this.users.find(user => user.id === id).status;}


/* ************************************************************************** */
/*                   POST                                                     */
/* ************************************************************************** */
    createUser(createUser : createUserDTO) : User {
        const { first_name, last_name } = createUser;
        const user : User = {
            id : uuid(),
            first_name,
            last_name,
            nick_name: setNickName(this.users, first_name, last_name),
            email: '',
            password: '',
            friends: [],
            status : UserStatus.ONLINE,
        };

        this.users.push(user);
        return user;
    }

    addFriend(userId : string, friendId : string) : User {
        let toAdd = this.users.find(user => user.id === friendId)
        if (!toAdd)
            throw new NotFoundException(`User \`${friendId}' not found`);
        let user = this.users.find(user => user.id === userId);
        if (!user)
            throw new NotFoundException(`User \`${userId}' not found`);
        user.friends.push(toAdd);
        return toAdd;
    }

/* ************************************************************************** */
/*                   DELETE                                                   */
/* ************************************************************************** */
    deleteUser(id : string) : User {
        let deleted : User = this.getUserId(id);
        this.users = this.users.filter(user => user.id !== deleted.id);
        return deleted;
    }


/* ************************************************************************** */
/*                   PATCH                                                    */
/* ************************************************************************** */
    patchStatus(id : string, status : UserStatus) : User {
        this.users.find(user => user.id === id).status = status;
        return this.users.find(user => user.id === id);
    }
}