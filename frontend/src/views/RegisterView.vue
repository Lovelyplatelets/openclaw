<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const form = reactive({ username: '', email: '', password: '' })

async function submit() {
  await auth.register(form)
  await router.push('/')
}
</script>

<template>
  <main class="shell">
    <section class="card">
      <h1>注册</h1>
      <form class="form" @submit.prevent="submit">
        <input v-model="form.username" type="text" placeholder="Username" required />
        <input v-model="form.email" type="email" placeholder="Email" required />
        <input v-model="form.password" type="password" placeholder="Password" required />
        <button :disabled="auth.loading" type="submit">注册</button>
      </form>
      <p v-if="auth.error" class="error">{{ auth.error }}</p>
    </section>
  </main>
</template>
