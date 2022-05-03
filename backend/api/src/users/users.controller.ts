import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import { createUserDTO } from './dto/create-user.dto';
import { User } from './users.model'
import {UsersService} from './users.service'

@Controller('users')
export class UsersController {
    constructor (private UsersService : UsersService) {}

    @Get()
    getUsers() : User[] {
        return this.UsersService.getUsers();
    }

    @Get('/:id')
    getUserId(@Param('id') id : string) : User {
        return this.UsersService.getUserId(id);
    }

    @Post()
    createUser(@Body() createUser : createUserDTO) {
        return this.UsersService.createUser(createUser);
    }
}
