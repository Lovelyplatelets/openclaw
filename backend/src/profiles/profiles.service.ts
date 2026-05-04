import {
  ForbiddenException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileResponse, toProfileResponse } from '../common/serializers';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(
    username: string,
    currentUserId?: string,
  ): Promise<ProfileResponse> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user)
      throw new NotFoundException({ errors: { profile: ['not found'] } });
    const following = currentUserId
      ? Boolean(
          await this.prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: currentUserId,
                followingId: user.id,
              },
            },
          }),
        )
      : false;
    return toProfileResponse(user, following);
  }

  async follow(username: string, followerId: string): Promise<ProfileResponse> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user)
      throw new NotFoundException({ errors: { profile: ['not found'] } });
    if (user.id === followerId)
      throw new ForbiddenException({
        errors: { profile: ['cannot follow yourself'] },
      });
    await this.prisma.follow.upsert({
      where: { followerId_followingId: { followerId, followingId: user.id } },
      create: { followerId, followingId: user.id },
      update: {},
    });
    return toProfileResponse(user, true);
  }

  async unfollow(
    username: string,
    followerId: string,
  ): Promise<ProfileResponse> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user)
      throw new NotFoundException({ errors: { profile: ['not found'] } });
    await this.prisma.follow.deleteMany({
      where: { followerId, followingId: user.id },
    });
    return toProfileResponse(user, false);
  }
}
