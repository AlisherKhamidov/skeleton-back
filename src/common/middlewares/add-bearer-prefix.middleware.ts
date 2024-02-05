import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AddBearerPrefixMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Add Bearer prefix if not already present
    if (
      req.cookies?.authorization &&
      !req.cookies?.authorization.startsWith('Bearer')
    ) {
      req.headers.authorization = `Bearer ${req.cookies?.authorization}`;
      // console.log('click');
    }
    // console.log('middleware', req.headers);
    next();
  }
}
