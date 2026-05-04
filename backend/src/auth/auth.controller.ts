import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login.dto';
import { RegisterRequestDto } from './dto/register.dto';
import { UpdateUserRequestDto } from './dto/update-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('users')
  register(@Body() body: RegisterRequestDto) {
    return this.authService.register(body.user);
  }

  @Post('users/login')
  login(@Body() body: LoginRequestDto) {
    return this.authService.login(body.user);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser('userId') userId: string) {
    return this.authService.getCurrentUser(userId);
  }

  @Put('user')
  @UseGuards(JwtAuthGuard)
  updateCurrentUser(
    @CurrentUser('userId') userId: string,
    @Body() body: UpdateUserRequestDto,
  ) {
    return this.authService.updateCurrentUser(userId, body.user);
  }
}
