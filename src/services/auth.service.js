// Authentication service with login, logout, token refresh, and user management

import RestService from './rest.service.js'

class AuthService {
  constructor() {
    this.rest = RestService
    this.currentUser = null
    this.isAuthenticated = false
    this.refreshTokenTimeout = null
  }

  // Login user with email and password
  async login(email, password) {
    try {
      const response = await this.rest.post('/auth/login', {
        email,
        password,
      })

      this.setAuthData(response)
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await this.rest.post('/auth/register', userData)
      return response
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  // Logout user
  async logout() {
    try {
      await this.rest.post('/auth/logout', {})
      this.clearAuthData()
    } catch (error) {
      console.error('Logout failed:', error)
      this.clearAuthData()
      throw error
    }
  }

  // Refresh authentication token
  async refreshToken() {
    try {
      const response = await this.rest.post('/auth/refresh', {})
      this.setAuthData(response)
      this.scheduleTokenRefresh()
      return response
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.clearAuthData()
      throw error
    }
  }

  // Verify email with token
  async verifyEmail(token) {
    try {
      const response = await this.rest.post('/auth/verify-email', { token })
      return response
    } catch (error) {
      console.error('Email verification failed:', error)
      throw error
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await this.rest.post('/auth/request-password-reset', {
        email,
      })
      return response
    } catch (error) {
      console.error('Password reset request failed:', error)
      throw error
    }
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      const response = await this.rest.post('/auth/reset-password', {
        token,
        newPassword,
      })
      return response
    } catch (error) {
      console.error('Password reset failed:', error)
      throw error
    }
  }

  // Change password for authenticated user
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await this.rest.patch('/auth/change-password', {
        currentPassword,
        newPassword,
      })
      return response
    } catch (error) {
      console.error('Password change failed:', error)
      throw error
    }
  }

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await this.rest.get('/auth/me')
      this.currentUser = response.data || response
      this.isAuthenticated = true
      return this.currentUser
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      this.currentUser = null
      this.isAuthenticated = false
      throw error
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await this.rest.patch('/auth/profile', userData)
      this.currentUser = response.data || response
      return this.currentUser
    } catch (error) {
      console.error('Profile update failed:', error)
      throw error
    }
  }

  // Upload profile picture
  async uploadProfilePicture(file) {
    try {
      const response = await this.rest.uploadFile('/auth/profile-picture', file)
      return response
    } catch (error) {
      console.error('Profile picture upload failed:', error)
      throw error
    }
  }

  // Set authentication data from login/refresh response
  setAuthData(data) {
    const token = data.access_token || data.token
    const user = data.user || data

    if (token) {
      this.rest.setToken(token)
      this.isAuthenticated = true
    }

    if (user && user.id) {
      this.currentUser = user
    }

    this.scheduleTokenRefresh()
    this.saveAuthState()
  }

  // Clear all authentication data
  clearAuthData() {
    this.rest.clearToken()
    this.currentUser = null
    this.isAuthenticated = false
    this.cancelTokenRefresh()
    this.clearAuthState()
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.isAuthenticated && !!this.rest.getToken()
  }

  // Get current user object
  getUser() {
    return this.currentUser
  }

  // Get stored token
  getToken() {
    return this.rest.getToken()
  }

  // Schedule automatic token refresh before expiration
  scheduleTokenRefresh() {
    this.cancelTokenRefresh()

    const token = this.rest.getToken()
    if (!token) return

    try {
      const decoded = this.decodeToken(token)
      const expirationTime = decoded.exp * 1000
      const now = Date.now()
      const timeUntilExpiry = expirationTime - now

      // Refresh 5 minutes before expiration
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60000)

      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshToken().catch(() => {
          this.clearAuthData()
        })
      }, refreshTime)
    } catch (error) {
      console.warn('Failed to schedule token refresh:', error)
    }
  }

  // Cancel scheduled token refresh
  cancelTokenRefresh() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout)
      this.refreshTokenTimeout = null
    }
  }

  // Decode JWT token (basic decoding)
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.warn('Failed to decode token:', error)
      throw new Error('Invalid token format')
    }
  }

  // Save auth state to localStorage
  saveAuthState() {
    const authState = {
      isAuthenticated: this.isAuthenticated,
      currentUser: this.currentUser,
      token: this.rest.getToken(),
    }
    localStorage.setItem('auth_state', JSON.stringify(authState))
  }

  // Clear auth state from storage
  clearAuthState() {
    localStorage.removeItem('auth_state')
    sessionStorage.removeItem('auth_state')
  }

  // Restore auth state from localStorage
  restoreAuthState() {
    try {
      const authState = localStorage.getItem('auth_state')
      if (authState) {
        const state = JSON.parse(authState)
        this.isAuthenticated = state.isAuthenticated
        this.currentUser = state.currentUser

        if (state.token) {
          this.rest.setToken(state.token)
          this.scheduleTokenRefresh()
          return true
        }
      }
    } catch (error) {
      console.warn('Failed to restore auth state:', error)
      this.clearAuthData()
    }
    return false
  }
}

export default new AuthService()
