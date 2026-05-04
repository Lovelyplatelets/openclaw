import { Comment, User, Article, Tag } from '@prisma/client';

export type UserResponse = {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string | null;
    image: string | null;
  };
};

export type ProfileResponse = {
  profile: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
};

export type CommentResponse = {
  comment: {
    id: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    author: {
      username: string;
      bio: string | null;
      image: string | null;
      following: boolean;
    };
  };
};

export type ArticleResponse = {
  article: {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: {
      username: string;
      bio: string | null;
      image: string | null;
      following: boolean;
    };
  };
};

export type ArticleListResponse = {
  articles: ArticleResponse['article'][];
  articlesCount: number;
};

export function toUserResponse(user: User, token: string): UserResponse {
  return {
    user: {
      email: user.email,
      token,
      username: user.username,
      bio: user.bio ?? null,
      image: user.image ?? null,
    },
  };
}

export function toProfileResponse(
  user: User,
  following: boolean,
): ProfileResponse {
  return {
    profile: {
      username: user.username,
      bio: user.bio ?? null,
      image: user.image ?? null,
      following,
    },
  };
}

export function toCommentResponse(
  comment: Comment,
  author: Pick<User, 'username' | 'bio' | 'image'>,
  following: boolean,
): CommentResponse {
  return {
    comment: {
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      author: {
        username: author.username,
        bio: author.bio ?? null,
        image: author.image ?? null,
        following,
      },
    },
  };
}

export function toArticleResponse(params: {
  article: Article;
  author: Pick<User, 'username' | 'bio' | 'image'>;
  tags: Pick<Tag, 'name'>[];
  favorited: boolean;
  favoritesCount: number;
  following: boolean;
}): ArticleResponse {
  const { article, author, tags, favorited, favoritesCount, following } =
    params;
  return {
    article: {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: tags.map((tag) => tag.name),
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      favorited,
      favoritesCount,
      author: {
        username: author.username,
        bio: author.bio ?? null,
        image: author.image ?? null,
        following,
      },
    },
  };
}
