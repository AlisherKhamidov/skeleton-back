import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductFileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsBoolean()
  @ApiProperty()
  isArchived: boolean;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
