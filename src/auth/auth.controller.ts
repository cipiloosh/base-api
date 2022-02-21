import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { sendMail, encrypt } from '../utils';
import { getLoginTemplate } from '../email-templates';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() body) {
    const domain = process.env.API_ROOT_DOMAIN;
    const user =
      (await this.authService.getUser(body)) ||
      (await this.authService.createUser(body));
    const token = await this.authService.signIn(user.email, user.id);
    const ecryptedToken = encrypt(token.accessToken);
    const mailHtml = getLoginTemplate(
      domain,
      user.email,
      `${domain}/?token=${ecryptedToken}`,
    );
    const mailStatus = await sendMail(user.email, 'login', mailHtml);

    if (mailStatus.status === 200) {
      return { status: 200 };
    }
    if (mailStatus.status === 500) {
      return { status: 500 };
    }
  }
}
