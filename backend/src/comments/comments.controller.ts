import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCommentRequestDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';

@Controller('articles')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':slug/comments')
  getComments(
    @Param('slug') slug: string,
    @CurrentUser('userId') userId?: string,
  ) {
    return this.commentsService.getComments(slug, userId);
  }

  @Post(':slug/comments')
  @UseGuards(JwtAuthGuard)
  createComment(
    @Param('slug') slug: string,
    @CurrentUser('userId') userId: string,
    @Body() body: CreateCommentRequestDto,
  ) {
    return this.commentsService.createComment(slug, userId, body.comment.body);
  }

  @Delete(':slug/comments/:id')
  @UseGuards(JwtAuthGuard)
  deleteComment(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.commentsService.deleteComment(slug, id, userId);
  }
}
