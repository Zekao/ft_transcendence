import { IsNotEmpty } from "class-validator";

export class createUserDTO {
  @IsNotEmpty()
  first_name: string;
  @IsNotEmpty()
  last_name: string;
}
