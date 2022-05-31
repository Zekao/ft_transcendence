import { Controller, Param, Body, Query, Get, Post, Delete, Patch } from '@nestjs/common';
import { createUserDTO } from './dto/create-user.dto';
import { UsersFiltesDTO } from './dto/user-filter.dto';
import { UserStatus } from './users-status.enum'
import { User } from './users.entity';
import {UsersService} from './users.service'

@Controller('users')
export class UsersController {
    constructor (private UsersService : UsersService) {}

/* ************************************************************************** */
/*                   GET                                                      */
/* ************************************************************************** */
    // @Get()
    // getUsers(@Query() filters : UsersFiltesDTO) : User[] {
    //     if (Object.keys(filters).length)
    //         return this.UsersService.getUserByFilter(filters);
    //     return this.UsersService.getUsers();
    // }

    @Get('/:id')
    getUserId(@Param('id') id : string) : Promise<User> {
        return this.UsersService.getUserId(id);
    }

    // @Get('/:id/status')
    // getUserStatus(@Param('id') id : string) : UserStatus {
    //     return this.UsersService.getUserStatus(id)
    // }
    


/* ************************************************************************** */
/*                   POST                                                     */
/* ************************************************************************** */
    @Post()
    createUser(@Body() createUser : createUserDTO) : Promise<User> {
        return this.UsersService.createUser(createUser);
    }

    // @Post('/friends/:id')
    // addFriend(@Param('id') id : string, @Query() query) : User {
    //     return this.UsersService.addFriend(id, query.id);
    // }


/* ************************************************************************** */
/*                   DELETE                                                   */
/* ************************************************************************** */
    // @Delete('/:id')
    // deleteUser(@Param('id') id : string) {
    //     return this.UsersService.deleteUser(id);
    // }


/* ************************************************************************** */
/*                   PATCH                                                    */
/* ************************************************************************** */

    // @Patch('/:id')
    // patchStatus(@Param('id') id : string, @Query() query) {
    //     return this.UsersService.patchStatus(id, query.status);
    // }
}
