import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { sendMail } from '../utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() body) {
    const user =
      (await this.authService.getUser(body)) ||
      (await this.authService.createUser(body));
    const token = await this.authService.signIn(user.email, user.id);

    const mailStatus = await sendMail(user.email, 'Welcome', token.accessToken);

    if (mailStatus.status === 200) {
      return { status: 200 };
    }
    if (mailStatus.status === 500) {
      return { status: 500 };
    }
  }
}
