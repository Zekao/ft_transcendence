import { ApiProperty } from "@nestjs/swagger";

export class QRObjects {
  @ApiProperty()
  qrcode: string;
  @ApiProperty()
  secret: string;
}
