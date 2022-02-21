import { Controller, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { sendMail, crypto, isProd } from '../utils';
import { getLoginTemplate } from '../email-templates';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() body) {
    const production = isProd();
    const domain = process.env.API_ROOT_DOMAIN;
    const user =
      (await this.authService.getUser(body)) ||
      (await this.authService.createUser(body));
    const token = await this.authService.signIn(user.email, user.id);
    const ecryptedToken = crypto.encrypt(token.accessToken);

    const oldToken = await this.authService.getToken();

    if (oldToken) {
      await this.authService.deleteToken({ id: oldToken.id });
    }

    const newToken = await this.authService.createToken({
      user: { connect: { id: user.id } },
      token: ecryptedToken,
    });

    const loginHtmlContent = getLoginTemplate(
      domain,
      user.email,
      `${domain}/?token=${newToken.token}`,
    );

    production && (await sendMail(user.email, 'login', loginHtmlContent));

    return production ? { token: 'sent' } : { token: newToken.token };
  }

  @Post('/getAuthToken')
  async auth(@Query('token') token: string) {
    const searchRegExp = /\s/g;
    const replaceWith = '+';
    const queryToken = token.replace(searchRegExp, replaceWith);

    const jwt = await this.authService.getJwtToken({ token: queryToken });

    if (jwt) {
      this.authService.deleteToken({ token: queryToken });
    }

    return { authToken: jwt };
  }
}
