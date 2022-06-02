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
    async getUsers() : Promise<User[]> {
        const users = await this.UserRepository.find();
        if (!users) throw new NotFoundException(`Users not found`);
        return users;
    }

    async getUserByFilter(filter : UsersFiltesDTO) : Promise<User[]> {
        const { status, search } = filter;
        let users = await this.getUsers();
        if (status) users = users.filter((user) => user.status === status);
        if (search) users = users.filter((user) => {
            if (user.id.includes(search)) return true;
            if (user.first_name.includes(search)) return true;
            if (user.last_name.includes(search)) return true;
            if (user.user_name.includes(search)) return true;
            if (user.email.includes(search)) return true;
        })
        if (!users) throw new NotFoundException(`Users not found`);
        return users;
    }

    async getUserId(id: string) : Promise<User> {
        const found = await this.UserRepository.findOne(id);
        if (!found) throw new NotFoundException(`User \`${id}' not found`);
        return found;
    }

    async getUserStatus(id : string) : Promise<UserStatus> {
        const found = await this.UserRepository.findOne(id);
        if (!found) throw new NotFoundException(`User \`${id}' not found`);
        return found.status;
    }


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

/* ************************************************************************** */
/*                   DELETE                                                   */
/* ************************************************************************** */
    async deleteUser(id : string) : Promise<void> {
        const target = await this.UserRepository.delete(id)
        if (target.affected === 0) throw new NotFoundException(`User \`${id}' not found`);
    }


/* ************************************************************************** */
/*                   PATCH                                                    */
/* ************************************************************************** */
    async patchStatus(id : string, status : UserStatus) : Promise<UserStatus> {
        const found = await this.UserRepository.findOne(id);
        if (!found) throw new NotFoundException(`User \`${id}\` not found`);
        found.status = status;
        return found.status;
    }
}