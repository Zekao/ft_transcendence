import {
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { user_name, password } = authCredentialsDto;
    // hash the password with bcrypt before storing it
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({
      user_name,
      password: hashedPassword,
      email: user_name + "@transcendence.com",
      first_name: "",
      last_name: "",
      status: "", // replace this values by user values
    });
    // debug to see if password correctly get hashed
    console.log("salt value : ", salt);
    console.log(user.user_name, user.password, user.email);
    try {
      await this.save(user);
    } catch (error) {
      // 23505 = error code for duplicate username
      if (error.code == "23505") {
        throw new ConflictException("Username already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
