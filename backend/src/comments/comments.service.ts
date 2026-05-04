import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommentResponse, toCommentResponse } from '../common/serializers';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getComments(slug: string, currentUserId?: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article)
      throw new NotFoundException({ errors: { article: ['not found'] } });
    const comments = await this.prisma.comment.findMany({
      where: { articleId: article.id },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
    const results = await Promise.all(
      comments.map(async (comment): Promise<CommentResponse['comment']> => {
        const following = currentUserId
          ? Boolean(
              await this.prisma.follow.findUnique({
                where: {
                  followerId_followingId: {
                    followerId: currentUserId,
                    followingId: comment.authorId,
                  },
                },
              }),
            )
          : false;
        return toCommentResponse(comment, comment.author, following).comment;
      }),
    );
    return { comments: results };
  }

  async createComment(slug: string, userId: string, body: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article)
      throw new NotFoundException({ errors: { article: ['not found'] } });
    const comment = await this.prisma.comment.create({
      data: { body, articleId: article.id, authorId: userId },
      include: { author: true },
    });
    return toCommentResponse(comment, comment.author, false);
  }

  async deleteComment(slug: string, id: string, userId: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article)
      throw new NotFoundException({ errors: { article: ['not found'] } });
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment)
      throw new NotFoundException({ errors: { comment: ['not found'] } });
    if (comment.authorId !== userId)
      throw new ForbiddenException({ errors: { comment: ['not allowed'] } });
    await this.prisma.comment.delete({ where: { id } });
    return { comment: null };
  }
}
