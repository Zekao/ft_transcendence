import { Injectable, NotFoundException } from '@nestjs/common';
import { UserStatus } from './users-status.enum';
import { createUserDTO } from './dto/create-user.dto';
import { UsersFiltesDTO } from './dto/user-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

function setNickName(users : User[], first : string, last : string) : string{
    let nick : string;
    let first_size : number = 1;
    let cond: boolean = false;
    while (!cond) {
        cond = true;
        nick = `${first.slice(0, first_size)}${last}`;
        for (let i = 0; i < users.length; i++) {
            if (users[i].user_name === nick) {
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
    constructor(@InjectRepository(User) private UserRepository: Repository<User>) {};
    
/* ************************************************************************** */
/*                   GET                                                      */
/* ************************************************************************** */
    async   getUser(): Promise<User[]> {
        return this.UserRepository.find();
    }
    // getUsers() : User[] {return this.users;}

    // getUserByFilter(filter : UsersFiltesDTO) : User[] {
    //     const { status, search } = filter;
    //     let users = this.getUsers();
    //     if (status) users = users.filter((user) => user.status === status);
    //     if (search) users = users.filter((user) => {
    //         if (user.id.includes(search)) return true;
    //         if (user.first_name.includes(search)) return true;
    //         if (user.last_name.includes(search)) return true;
    //         if (user.nick_name.includes(search)) return true;
    //         if (user.email.includes(search)) return true;
    //     })
    //     return users;
    // }

    async getUserId(id: string) : Promise<User> {
        const found = await this.UserRepository.findOne(id);
        if (!found) throw new NotFoundException(`User \`${id}' not found`);
        return found;
    }

    // getUserStatus(id : string) : UserStatus {return this.users.find(user => user.id === id).status;}


/* ************************************************************************** */
/*                   POST                                                     */
/* ************************************************************************** */
    async createUser(createUser : createUserDTO) : Promise<User> {
        const { first_name, last_name } = createUser;
        const username = setNickName(await this.getUser(), first_name, last_name)
        const user = this.UserRepository.create({
            first_name,
            last_name,
            user_name: username,
            email: `${username}@transcendence.com`,
            status: UserStatus.ONLINE
        });
        await this.UserRepository.save(user);
        return user;
    }

    //     this.users.push(user);
    //     return user;
    // }

    // addFriend(userId : string, friendId : string) : User {
    //     let toAdd = this.users.find(user => user.id === friendId)
    //     if (!toAdd)
    //         throw new NotFoundException(`User \`${friendId}' not found`);
    //     let user = this.users.find(user => user.id === userId);
    //     if (!user)
    //         throw new NotFoundException(`User \`${userId}' not found`);
    //     user.friends.push(toAdd);
    //     return toAdd;
    // }

/* ************************************************************************** */
/*                   DELETE                                                   */
/* ************************************************************************** */
    // deleteUser(id : string) : User {
    //     let deleted : User = this.getUserId(id);
    //     this.users = this.users.filter(user => user.id !== deleted.id);
    //     return deleted;
    // }


/* ************************************************************************** */
/*                   PATCH                                                    */
/* ************************************************************************** */
    // patchStatus(id : string, status : UserStatus) : User {
    //     this.users.find(user => user.id === id).status = status;
    //     return this.users.find(user => user.id === id);
    // }
}