import {
  Injectable,
  NestMiddleware,
  // UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../auth/auth.service'; // Your authentication service

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token
    if (token) {
      try {
        const user = await this.authService.validateUser(token);
        req.user = user; // Attach user to request object
        next();
      } catch (error) {
        console.log('invalid token');
      }
    } else {
      // throw new UnauthorizedException('Token not found');
      next();
    }
  }
}
