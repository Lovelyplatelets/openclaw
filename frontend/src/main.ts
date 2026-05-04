import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import ArticleDetailView from './views/ArticleDetailView.vue'
import EditorView from './views/EditorView.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/article/:slug', name: 'article', component: ArticleDetailView },
    { path: '/editor', name: 'editor', component: EditorView },
  ],
})

createApp(App).use(createPinia()).use(router).mount('#app')
