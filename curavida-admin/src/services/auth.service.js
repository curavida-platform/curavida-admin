import api from './api'

const authService = {
       async login(email, password) {
              const response = await api.post('/auth/login', {
                     email,
                     password,
              })

              return response.data
       },

       async me(token) {
              const response = await api.get('/auth/me', {
                     headers: {
                            Authorization: `Bearer ${token}`,
                     },
              })

              return response.data
       },
}

export default authService