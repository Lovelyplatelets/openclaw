<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useArticleStore } from '../stores/articles'

const store = useArticleStore()

onMounted(() => {
  void store.fetchArticles()
})

const articles = computed(() => store.articles)
</script>

<template>
  <main class="shell">
    <header class="toolbar">
      <h1>Conduit</h1>
      <nav>
        <RouterLink to="/login">登录</RouterLink>
        <RouterLink to="/register">注册</RouterLink>
        <RouterLink to="/editor">发布</RouterLink>
      </nav>
    </header>

    <section class="card">
      <h2>Global Feed</h2>
      <p v-if="store.loading">Loading...</p>
      <ul v-else-if="articles.length">
        <li v-for="article in articles" :key="article.slug">
          <RouterLink :to="`/article/${article.slug}`">{{ article.title }}</RouterLink>
          <p>{{ article.description }}</p>
        </li>
      </ul>
      <p v-else>暂无文章</p>
    </section>
  </main>
</template>
