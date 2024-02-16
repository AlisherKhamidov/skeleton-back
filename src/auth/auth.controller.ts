import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.login(email, password);
    response.cookie('authorization', token.accessToken, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    return token;
  }

  @Post('logout')
  @ApiResponse({
    status: 201,
    description: 'Successful logout',
  })
  async logout(@Res({ passthrough: true }) response: Response) {
    const token = 'x3xcssd';
    // set cookie which is experied
    response.cookie('authorization', token, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    return {
      status: 201,
      description: 'Successful logout',
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    // Access user information from the request object
    return req.user;
  }
}
