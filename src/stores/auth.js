import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },
  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/login', credentials)
        if (response.data.success) {
          this.token = response.data.token
          this.user = response.data.user
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
          return response.data
        }
      } catch (error) {
        throw error
      }
    },
    async register(userData) {
      try {
        const response = await api.post('/register', userData)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async verifyOtp(email, otp_code) {
      try {
        const response = await api.post('/verify-otp', { email, otp_code })
        return response.data
      } catch (error) {
        throw error
      }
    },
    async fetchUser() {
      try {
        const response = await api.get('/me')
        if (response.data.success) {
          this.user = response.data.user
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      } catch (error) {
        this.logout()
        throw error
      }
    },
    async logout() {
      try {
        // Optionnel : on peut appeler l'API de logout si nécessaire
        await api.post('/logout')
      } catch (e) {
        console.error('Erreur lors du logout API', e)
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }
})
