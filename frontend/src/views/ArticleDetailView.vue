<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '../stores/articles'

const route = useRoute()
const store = useArticleStore()

onMounted(() => {
  const slug = String(route.params.slug)
  if (slug) void store.fetchArticle(slug)
})
</script>

<template>
  <main class="shell">
    <section class="card">
      <p v-if="store.loading">Loading...</p>
      <template v-else-if="store.selected">
        <h1>{{ store.selected.title }}</h1>
        <p>{{ store.selected.description }}</p>
        <article>{{ store.selected.body }}</article>
      </template>
      <p v-else>文章不存在</p>
    </section>
  </main>
</template>
