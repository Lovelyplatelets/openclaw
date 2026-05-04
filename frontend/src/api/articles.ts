import { api } from './client'

export const articleApi = {
  list(params?: Record<string, string | number>) {
    return api.get('/articles', { params })
  },
  detail(slug: string) {
    return api.get(`/articles/${slug}`)
  },
  create(article: { title: string; description: string; body: string; tagList: string[] }) {
    return api.post('/articles', { article })
  },
  addComment(slug: string, body: string) {
    return api.post(`/articles/${slug}/comments`, { comment: { body } })
  },
}
