import { ApiProperty } from "@nestjs/swagger";
import { Matches } from "class-validator";

export class FileUploadDto {
  @Matches(/\.(jpg|jpeg|png|gif)$/, {
    message: "Only image files are allowed!",
  })
  @ApiProperty({ type: "string", format: "binary" })
  file: any;
}
