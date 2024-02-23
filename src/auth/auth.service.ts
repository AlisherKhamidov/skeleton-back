//src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }
  async validateUser(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // You might have logic here to fetch user information from a database
      // using the decodedToken.sub (subject) or any other identifier from the token
      // For demonstration purposes, let's assume user data is retrieved directly from the token.
      const userId = decodedToken.userId; // Assuming user information is stored in the token payload under 'user'
      const user = this.usersService.findOne(userId);
      return user;
    } catch (error) {
      return null;
    }
  }
}
