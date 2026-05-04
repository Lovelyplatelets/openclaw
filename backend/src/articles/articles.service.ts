import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article, Prisma } from '@prisma/client';
import slugify from 'slugify';
import {
  ArticleListResponse,
  ArticleResponse,
  toArticleResponse,
} from '../common/serializers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticlePayloadDto } from './dto/create-article.dto';
import { UpdateArticlePayloadDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  private async articleResponse(
    article: Article,
    currentUserId?: string,
  ): Promise<ArticleResponse> {
    const full = await this.prisma.article.findUnique({
      where: { id: article.id },
      include: {
        author: true,
        articleTags: { include: { tag: true } },
        favorites: true,
      },
    });
    if (!full)
      throw new NotFoundException({ errors: { article: ['not found'] } });
    const following = currentUserId
      ? Boolean(
          await this.prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: currentUserId,
                followingId: full.authorId,
              },
            },
          }),
        )
      : false;
    return toArticleResponse({
      article: full,
      author: full.author,
      tags: full.articleTags.map((item) => item.tag),
      favorited: currentUserId
        ? full.favorites.some((favorite) => favorite.userId === currentUserId)
        : false,
      favoritesCount: full.favorites.length,
      following,
    });
  }

  async list(
    query: Record<string, string | undefined>,
    currentUserId?: string,
  ): Promise<ArticleListResponse> {
    const limit = Math.min(Number(query.limit ?? 20) || 20, 100);
    const offset = Number(query.offset ?? 0) || 0;
    const where: Prisma.ArticleWhereInput = {
      ...(query.author ? { author: { username: query.author } } : {}),
      ...(query.tag
        ? { articleTags: { some: { tag: { name: query.tag } } } }
        : {}),
      ...(query.favorited
        ? { favorites: { some: { user: { username: query.favorited } } } }
        : {}),
    };
    const [items, articlesCount] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          author: true,
          articleTags: { include: { tag: true } },
          favorites: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.article.count({ where }),
    ]);
    const articles = await Promise.all(
      items.map((item) =>
        this.articleResponse(item, currentUserId).then((r) => r.article),
      ),
    );
    return { articles, articlesCount };
  }

  async getBySlug(
    slug: string,
    currentUserId?: string,
  ): Promise<ArticleResponse> {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article)
      throw new NotFoundException({ errors: { article: ['not found'] } });
    return this.articleResponse(article, currentUserId);
  }

  async create(
    userId: string,
    dto: CreateArticlePayloadDto,
  ): Promise<ArticleResponse> {
    const baseSlug = slugify(dto.title, { lower: true, strict: true });
    let slug = baseSlug;
    let suffix = 1;
    while (await this.prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const article = await this.prisma.article.create({
      data: {
        slug,
        title: dto.title,
        description: dto.description,
        body: dto.body,
        authorId: userId,
      },
    });

    if (dto.tagList?.length) {
      const tagLinks = await this.ensureTags(dto.tagList, article.id);
      await this.prisma.articleTag.createMany({
        data: tagLinks,
        skipDuplicates: true,
      });
    }

    return this.getBySlug(article.slug, userId);
  }

  async update(
    slug: string,
    userId: string,
    dto: UpdateArticlePayloadDto,
  ): Promise<ArticleResponse> {
    const existing = await this.prisma.article.findUnique({ where: { slug } });
    if (!existing)
      throw new NotFoundException({ errors: { article: ['not found'] } });
    if (existing.authorId !== userId)
      throw new ForbiddenException({ errors: { article: ['not allowed'] } });

    let nextSlug = existing.slug;
    if (dto.title && dto.title !== existing.title) {
      const baseSlug = slugify(dto.title, { lower: true, strict: true });
      nextSlug = baseSlug;
      let suffix = 1;
      while (
        await this.prisma.article.findFirst({
          where: { slug: nextSlug, NOT: { id: existing.id } },
        })
      ) {
        nextSlug = `${baseSlug}-${suffix++}`;
      }
    }

    await this.prisma.article.update({
      where: { id: existing.id },
      data: {
        slug: nextSlug,
        title: dto.title,
        description: dto.description,
        body: dto.body,
      },
    });
    if (dto.tagList) {
      await this.prisma.articleTag.deleteMany({
        where: { articleId: existing.id },
      });
      await this.prisma.articleTag.createMany({
        data: await this.ensureTags(dto.tagList, existing.id),
        skipDuplicates: true,
      });
    }
    return this.getBySlug(nextSlug, userId);
  }

  async remove(slug: string, userId: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article)
      throw new NotFoundException({ errors: { article: ['not found'] } });
    if (article.authorId !== userId)
      throw new ForbiddenException({ errors: { article: ['not allowed'] } });
    await this.prisma.article.delete({ where: { id: article.id } });
    return { article: null };
  }

  async favorite(slug: string, userId: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article)
      throw new NotFoundException({ errors: { article: ['not found'] } });
    await this.prisma.favorite.upsert({
      where: { userId_articleId: { userId, articleId: article.id } },
      create: { userId, articleId: article.id },
      update: {},
    });
    return this.getBySlug(slug, userId);
  }

  async unfavorite(slug: string, userId: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article)
      throw new NotFoundException({ errors: { article: ['not found'] } });
    await this.prisma.favorite.deleteMany({
      where: { userId, articleId: article.id },
    });
    return this.getBySlug(slug, userId);
  }

  private async ensureTags(tagList: string[], articleId?: string) {
    const data: { articleId: string; tagId: string }[] = [];
    for (const name of tagList) {
      const tag = await this.prisma.tag.upsert({
        where: { name },
        create: { name },
        update: {},
      });
      if (articleId) data.push({ articleId, tagId: tag.id });
      else data.push({ articleId: '', tagId: tag.id });
    }
    return data;
  }
}
