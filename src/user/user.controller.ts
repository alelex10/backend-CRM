import { Controller, Get, Param, Req, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // traer perfil

  @Get('/profile')
  getProfile(@Request() req: any) {
    return this.userService.getProfile(req.user.id);
  }
}
