import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { UpdateUserPayloadDto } from './dto/update-user.dto';
import { toUserResponse, UserResponse } from '../common/serializers';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private signToken(user: User) {
    return this.jwtService.sign({
      userId: user.id,
      email: user.email,
      username: user.username,
    });
  }

  async register(dto: RegisterUserDto): Promise<UserResponse> {
    const [emailExists, usernameExists] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: dto.email } }),
      this.prisma.user.findUnique({ where: { username: dto.username } }),
    ]);
    if (emailExists)
      throw new ConflictException({
        errors: { email: ['has already been taken'] },
      });
    if (usernameExists)
      throw new ConflictException({
        errors: { username: ['has already been taken'] },
      });
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, username: dto.username, passwordHash },
    });
    return toUserResponse(user, this.signToken(user));
  }

  async login(dto: LoginUserDto): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user)
      throw new UnauthorizedException({
        errors: { 'email or password': ['is invalid'] },
      });
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok)
      throw new UnauthorizedException({
        errors: { 'email or password': ['is invalid'] },
      });
    return toUserResponse(user, this.signToken(user));
  }

  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException({ errors: { user: ['not found'] } });
    return toUserResponse(user, this.signToken(user));
  }

  async updateCurrentUser(
    userId: string,
    dto: UpdateUserPayloadDto,
  ): Promise<UserResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existing)
      throw new NotFoundException({ errors: { user: ['not found'] } });

    if (dto.email && dto.email !== existing.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (emailExists)
        throw new ConflictException({
          errors: { email: ['has already been taken'] },
        });
    }
    if (dto.username && dto.username !== existing.username) {
      const usernameExists = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });
      if (usernameExists)
        throw new ConflictException({
          errors: { username: ['has already been taken'] },
        });
    }

    const data: Prisma.UserUpdateInput = {
      email: dto.email,
      username: dto.username,
      bio: dto.bio === undefined ? undefined : dto.bio,
      image: dto.image === undefined ? undefined : dto.image,
      passwordHash: dto.password
        ? await bcrypt.hash(dto.password, 10)
        : undefined,
    };
    const user = await this.prisma.user.update({ where: { id: userId }, data });
    return toUserResponse(user, this.signToken(user));
  }
}
