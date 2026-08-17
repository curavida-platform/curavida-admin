import { defineStore } from 'pinia'
import authService from '../services/auth.service'

export const useAuthStore = defineStore('auth', {
       state: () => ({
              token: localStorage.getItem('curavida-admin-token') || null,
              user: null,
              loading: false,
       }),

       getters: {
              isAuthenticated: (state) => {
                     return !!state.token
              },

              isAdmin: (state) => {
                     return state.user?.role === 'ADMIN'
              },
       },

       actions: {
              async login(email, password) {
                     this.loading = true

                     try {
                            const response = await authService.login(email, password)

                            const token =
                                   response.token ||
                                   response.data?.token

                            const user =
                                   response.user ||
                                   response.data?.user ||
                                   null

                            if (!token) {
                                   throw new Error('Token não recebido pela API.')
                            }

                            if (!user) {
                                   throw new Error('Usuário não recebido pela API.')
                            }

                            // 🔐 Verifica se é administrador
                            if (user.role !== 'ADMIN') {
                                   throw new Error(
                                          'Você não possui permissão para acessar o painel administrativo.'
                                   )
                            }

                            this.token = token
                            this.user = user

                            localStorage.setItem(
                                   'curavida-admin-token',
                                   token,
                            )

                            return response
                     } finally {
                            this.loading = false
                     }
              },

              async fetchUser() {
                     if (!this.token) {
                            return null
                     }

                     try {
                            const response = await authService.me(this.token)

                            const user =
                                   response.user ||
                                   response.data?.user ||
                                   response

                            if (user.role !== 'ADMIN') {
                                   this.logout()

                                   throw new Error(
                                          'Você não possui permissão para acessar o painel administrativo.'
                                   )
                            }

                            this.user = user

                            return this.user
                     } catch (error) {
                            this.logout()
                            throw error
                     }
              },

              logout() {
                     this.token = null
                     this.user = null

                     localStorage.removeItem(
                            'curavida-admin-token',
                     )
              },
       },
})