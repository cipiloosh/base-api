import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from 'src/common/get-user.decorator';
import { User } from 'src/common/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  async findOne(@GetUser() user: User) {
    return await this.userService.findOne(user);
  }
}
