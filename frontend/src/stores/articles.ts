import { defineStore } from 'pinia'
import { ref } from 'vue'
import { articleApi } from '../api/articles'

export type Article = {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: {
    username: string
    bio: string | null
    image: string | null
    following: boolean
  }
}

export const useArticleStore = defineStore('articles', () => {
  const articles = ref<Article[]>([])
  const selected = ref<Article | null>(null)
  const loading = ref(false)

  async function fetchArticles() {
    loading.value = true
    try {
      const { data } = await articleApi.list()
      articles.value = data.articles
    } finally {
      loading.value = false
    }
  }

  async function fetchArticle(slug: string) {
    loading.value = true
    try {
      const { data } = await articleApi.detail(slug)
      selected.value = data.article
    } finally {
      loading.value = false
    }
  }

  async function publish(payload: { title: string; description: string; body: string; tagList: string[] }) {
    const { data } = await articleApi.create(payload)
    selected.value = data.article
    return data.article as Article
  }

  return { articles, selected, loading, fetchArticles, fetchArticle, publish }
})
