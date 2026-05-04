import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':username')
  getProfile(
    @Param('username') username: string,
    @CurrentUser('userId') userId?: string,
  ) {
    return this.profilesService.getProfile(username, userId);
  }

  @Post(':username/follow')
  @UseGuards(JwtAuthGuard)
  follow(
    @Param('username') username: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.profilesService.follow(username, userId);
  }

  @Delete(':username/follow')
  @UseGuards(JwtAuthGuard)
  unfollow(
    @Param('username') username: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.profilesService.unfollow(username, userId);
  }
}
