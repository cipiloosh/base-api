import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { sendMail, crypto, isProd } from '../utils';
import { getLoginTemplate } from '../email-templates';
import { FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() body: { email: string }) {
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
      `${domain}/signin?token=${newToken.token}`,
    );

    production && (await sendMail(user.email, 'login', loginHtmlContent));

    return production ? { token: 'sent' } : { token: newToken.token };
  }

  @Post('/getAuthToken')
  async auth(
    @Body() body: { token: string },
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const jwt = await this.authService.getJwtToken({ token: body.token });

    if (jwt) {
      this.authService.deleteToken({ token: body.token });
    }
    jwt &&
      response.setCookie('authToken', jwt, {
        expires: new Date(Date.now() + 3600 * 2000 * 28 * 180 * 1),
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
    return { authToken: jwt };
  }
}
