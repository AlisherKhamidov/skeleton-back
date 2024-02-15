import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false, nullable: true })
  photo: string | null;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsBoolean()
  @ApiProperty()
  isArchived: boolean;
}
