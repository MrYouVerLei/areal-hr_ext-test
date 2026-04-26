import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req, @Body() user: LoginDto) {
    return req.user;
  }

  @Post('logout')
  async logout(@Req() req, @Res() res) {
    await new Promise((resolve) => req.session.destroy(() => resolve(true)));
    res.clearCookie('connect.sid');
    return res.end();
  }

  @Public()
  @Get('status')
  getStatus(@Req() req) {
    if (req.isAuthenticated()) {
      return { result: true, user: req.user };
    } else {
      return { result: false };
    }
  }
}
