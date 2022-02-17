import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() body) {
    const user =
      (await this.authService.getUser(body)) ||
      (await this.authService.createUser(body));

    const token = await this.authService.signIn(user.email);

    return token;
  }
}
