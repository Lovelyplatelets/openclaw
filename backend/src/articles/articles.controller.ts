import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateArticleRequestDto } from './dto/create-article.dto';
import { UpdateArticleRequestDto } from './dto/update-article.dto';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  list(
    @Query() query: Record<string, string | undefined>,
    @CurrentUser('userId') userId?: string,
  ) {
    return this.articlesService.list(query, userId);
  }

  @Get(':slug')
  get(@Param('slug') slug: string, @CurrentUser('userId') userId?: string) {
    return this.articlesService.getBySlug(slug, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser('userId') userId: string,
    @Body() body: CreateArticleRequestDto,
  ) {
    return this.articlesService.create(userId, body.article);
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('slug') slug: string,
    @CurrentUser('userId') userId: string,
    @Body() body: UpdateArticleRequestDto,
  ) {
    return this.articlesService.update(slug, userId, body.article);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  remove(@Param('slug') slug: string, @CurrentUser('userId') userId: string) {
    return this.articlesService.remove(slug, userId);
  }

  @Post(':slug/favorite')
  @UseGuards(JwtAuthGuard)
  favorite(@Param('slug') slug: string, @CurrentUser('userId') userId: string) {
    return this.articlesService.favorite(slug, userId);
  }

  @Delete(':slug/favorite')
  @UseGuards(JwtAuthGuard)
  unfavorite(
    @Param('slug') slug: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.articlesService.unfavorite(slug, userId);
  }
}
