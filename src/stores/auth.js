import { defineStore } from 'pinia'
import AuthService from 'src/services/auth.service.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: AuthService.getUser(),       // reactive mirror of AuthService
    token: AuthService.getToken(),
    isAuthenticated: AuthService.isLoggedIn()
  }),

  actions: {
    async login(logicCredentials) {
      const logicObject = { ...logicCredentials }
      console.log('Auth Store Login with:', logicObject)
      const res = await AuthService.login(logicObject)
      this.user = AuthService.getUser()
      this.token = AuthService.getToken()
      this.isAuthenticated = AuthService.isLoggedIn()
      return res
    },

    async logout() {
      await AuthService.logout()
      this.user = null
      this.token = null
      this.isAuthenticated = false
    },

    restore() {
      if (AuthService.restoreAuthState()) {
        this.user = AuthService.getUser()
        this.token = AuthService.getToken()
        this.isAuthenticated = AuthService.isLoggedIn()
      }
    }
  }
})
