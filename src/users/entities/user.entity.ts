import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { Role } from 'src/auth/role/role.enum';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty()
  roles: string[];
}
