<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const form = reactive({ email: '', password: '' })

async function submit() {
  await auth.login(form)
  await router.push('/')
}
</script>

<template>
  <main class="shell">
    <section class="card">
      <h1>登录</h1>
      <form class="form" @submit.prevent="submit">
        <input v-model="form.email" type="email" placeholder="Email" required />
        <input v-model="form.password" type="password" placeholder="Password" required />
        <button :disabled="auth.loading" type="submit">登录</button>
      </form>
      <p v-if="auth.error" class="error">{{ auth.error }}</p>
    </section>
  </main>
</template>
