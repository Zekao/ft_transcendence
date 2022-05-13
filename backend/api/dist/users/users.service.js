"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_model_1 = require("./users.model");
const uuid_1 = require("uuid");
function setNickName(users, first, last) {
    let nick;
    let first_size = 1;
    let cond = false;
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
let UsersService = class UsersService {
    constructor() {
        this.users = [];
    }
    getUsers() { return this.users; }
    getUserByFilter(filter) {
        const { status, search } = filter;
        let users = this.getUsers();
        if (status)
            users = users.filter((user) => user.status === status);
        if (search)
            users = users.filter((user) => {
                if (user.id.includes(search))
                    return true;
                if (user.first_name.includes(search))
                    return true;
                if (user.last_name.includes(search))
                    return true;
                if (user.nick_name.includes(search))
                    return true;
                if (user.email.includes(search))
                    return true;
            });
        return users;
    }
    getUserId(id) {
        const found = this.users.find((user) => user.id === id);
        if (!found)
            throw new common_1.NotFoundException(`User \`${id}' not found`);
        return found;
    }
    getUserStatus(id) { return this.users.find(user => user.id === id).status; }
    createUser(createUser) {
        const { first_name, last_name } = createUser;
        const user = {
            id: (0, uuid_1.v4)(),
            first_name,
            last_name,
            nick_name: setNickName(this.users, first_name, last_name),
            email: '',
            password: '',
            friends: [],
            status: users_model_1.UserStatus.ONLINE,
        };
        this.users.push(user);
        return user;
    }
    addFriend(userId, friendId) {
        let toAdd = this.users.find(user => user.id === friendId);
        if (!toAdd)
            throw new common_1.NotFoundException(`User \`${friendId}' not found`);
        let user = this.users.find(user => user.id === userId);
        if (!user)
            throw new common_1.NotFoundException(`User \`${userId}' not found`);
        user.friends.push(toAdd);
        return toAdd;
    }
    deleteUser(id) {
        let deleted = this.getUserId(id);
        this.users = this.users.filter(user => user.id !== deleted.id);
        return deleted;
    }
    patchStatus(id, status) {
        this.users.find(user => user.id === id).status = status;
        return this.users.find(user => user.id === id);
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map