<template>
  <main class="auth-view">
    <section class="auth-card">
      <h1 class="primary">{{ mode === 'login' ? 'Sign In' : 'Create Account' }}</h1>
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label for="username">Username</label>
          <input v-model="username" type="text" id="username" required autocomplete="username" />
        </div>
        <div v-if="mode === 'register'" class="field">
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" autocomplete="email" required />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input v-model="password" type="password" id="password" autocomplete="current-password" required />
        </div>
        <button :disabled="loading" type="submit" class="main-btn">
          {{ mode === 'login' ? 'Sign In' : 'Register' }}
        </button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
      <div class="switch">
        <span>
          {{ mode === 'login' ? "Don't have an account?" : "Already have an account?" }}
        </span>
        <a href="#" @click.prevent="toggleMode">{{ mode === 'login' ? 'Register' : 'Sign In' }}</a>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const mode = ref<'login' | 'register'>('login')
const username = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const loading = computed(() => auth.loading)
const error = computed(() => auth.error)

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  auth.error = null
}

async function handleSubmit() {
  if (mode.value === 'login') {
    await auth.login(username.value, password.value)
    if (auth.isAuthenticated) router.push('/')
  } else {
    await auth.register(username.value, email.value, password.value)
    if (auth.isAuthenticated) router.push('/')
  }
}
</script>

<style scoped>
.auth-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
}
.auth-card {
  min-width: 320px;
  background: #fff;
  box-shadow: 0 2px 32px rgba(60, 60, 60, 0.085);
  border-radius: 12px;
  padding: 2.2rem 2.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  color: #3b82f6;
  font-size: 2rem;
  margin-bottom: 1.6rem;
  text-align: center;
}
form {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.field {
  margin-bottom: 1.3rem;
  display: flex;
  flex-direction: column;
}
label {
  margin-bottom: 0.4rem;
  color: #64748b;
  font-weight: 500;
}
input {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.6rem 0.9rem;
  font-size: 1rem;
}
input:focus {
  border-color: #3b82f6;
  outline: none;
}
.main-btn {
  background: #3b82f6;
  color: #fff;
  border-radius: 6px;
  border: none;
  padding: 0.8rem 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.main-btn:disabled {
  background: #93c5fd;
}
.error {
  color: #f05942;
  margin-bottom: 1rem;
  text-align: center;
}
.switch {
  margin-top: 0.7rem;
  color: #64748b;
  font-size: 0.98rem;
  text-align: center;
}
.switch a {
  margin-left: 0.3rem;
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
}
</style>
