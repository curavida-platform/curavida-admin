<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
       try {
              loading.value = true
              error.value = ''

              await authStore.login(
                     email.value,
                     password.value,
              )

              router.push('/')
       } catch (err) {
              console.error('Erro ao fazer login:', err)

              error.value =
                     err.response?.data?.message ||
                     err.message ||
                     'Não foi possível realizar o login.'
       } finally {
              loading.value = false
       }
}
</script>

<template>
       <main class="login-page">
              <section class="login-card">

                     <div class="login-header">
                            <span>CURAVIDA</span>

                            <h1>Área administrativa</h1>

                            <p>
                                   Entre com suas credenciais para acessar o painel.
                            </p>
                     </div>

                     <form @submit.prevent="handleLogin">

                            <div class="form-group">
                                   <label for="email">
                                          E-mail
                                   </label>

                                   <input id="email" v-model="email" type="email" placeholder="admin@curavida.com"
                                          autocomplete="email" required />
                            </div>

                            <div class="form-group">
                                   <label for="password">
                                          Senha
                                   </label>

                                   <input id="password" v-model="password" type="password" placeholder="Sua senha"
                                          autocomplete="current-password" required />
                            </div>

                            <p v-if="error" class="error">
                                   {{ error }}
                            </p>

                            <button type="submit" :disabled="loading">
                                   {{ loading ? 'Entrando...' : 'Entrar' }}
                            </button>

                     </form>

              </section>
       </main>
</template>

<style scoped>
.login-page {
       min-height: 100vh;

       display: flex;
       align-items: center;
       justify-content: center;

       padding: 24px;

       background: #f5f6f4;
}

.login-card {
       width: 100%;
       max-width: 420px;

       padding: 40px;

       background: white;

       border: 1px solid #e5e7eb;
       border-radius: 16px;
}

.login-header {
       margin-bottom: 30px;
}

.login-header>span {
       color: #2f7d5b;

       font-size: 12px;
       font-weight: 700;

       letter-spacing: 1.5px;
}

.login-header h1 {
       margin: 8px 0;

       color: #1f2933;

       font-size: 26px;
}

.login-header p {
       margin: 0;

       color: #6b7280;

       font-size: 14px;
       line-height: 1.5;
}

.form-group {
       display: flex;
       flex-direction: column;

       gap: 7px;

       margin-bottom: 18px;
}

.form-group label {
       color: #374151;

       font-size: 13px;
       font-weight: 600;
}

.form-group input {
       width: 100%;

       padding: 13px 14px;

       border: 1px solid #d1d5db;
       border-radius: 9px;

       outline: none;

       font-size: 14px;

       transition: border-color 0.2s;
}

.form-group input:focus {
       border-color: #2f7d5b;
}

button {
       width: 100%;

       min-height: 48px;

       margin-top: 8px;

       border: none;
       border-radius: 9px;

       background: #2f7d5b;
       color: white;

       font-size: 14px;
       font-weight: 700;

       cursor: pointer;
}

button:hover {
       background: #256448;
}

button:disabled {
       opacity: 0.6;
       cursor: not-allowed;
}

.error {
       margin: 0 0 15px;

       color: #b91c1c;

       font-size: 13px;
}
</style>