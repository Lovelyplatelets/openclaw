<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '../stores/articles'

const router = useRouter()
const store = useArticleStore()

const form = reactive({
  title: '',
  description: '',
  body: '',
  tagList: '',
})

async function submit() {
  const article = await store.publish({
    title: form.title,
    description: form.description,
    body: form.body,
    tagList: form.tagList
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean),
  })
  await router.push(`/article/${article.slug}`)
}
</script>

<template>
  <main class="shell">
    <section class="card">
      <h1>发布文章</h1>
      <form class="form" @submit.prevent="submit">
        <input v-model="form.title" type="text" placeholder="标题" required />
        <input v-model="form.description" type="text" placeholder="摘要" required />
        <textarea v-model="form.body" rows="10" placeholder="正文" required />
        <input v-model="form.tagList" type="text" placeholder="标签（逗号分隔）" />
        <button type="submit">发布</button>
      </form>
    </section>
  </main>
</template>
