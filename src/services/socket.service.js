// ../services/socket.service.js
import { io } from 'socket.io-client'

class SocketService {
  socket = null
  listeners = new Map()

  connect(token) {
    if (this.socket?.connected) {
      console.log('Socket already connected')
      return this.socket
    }

    if (this.socket) {
      this.socket.disconnect()
    }

    // DEBUG: Log all environment variables
    console.log('🔍 All env vars:', import.meta.env)
    console.log('🔍 VITE_API_URL:', import.meta.env.VITE_API_URL)

    const apiUrl = import.meta.env.VITE_API_URL

    if (!apiUrl || apiUrl === 'undefined') {
      console.error('❌ VITE_API_URL is not defined!')
      console.error('Current value:', apiUrl)
      // Fallback for development
      const fallbackUrl = 'http://localhost:5000'
      console.warn('⚠️ Using fallback URL:', fallbackUrl)

      this.socket = io(`${fallbackUrl}/messaging`, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      })
    } else {
      console.log('✅ Connecting to:', `${apiUrl}/messaging`)

      this.socket = io(`${apiUrl}/messaging`, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      })
    }

    this.setupEventHandlers()
    return this.socket
  }

  setupEventHandlers() {
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.log('🔴 Socket connection error:', error)
    })

    this.socket.on('error', (error) => {
      console.error('🔴 Socket error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.listeners.clear()
    }
  }

  isConnected() {
    return this.socket?.connected || false
  }

  joinConversation(conversationId, callback) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }

    this.socket.emit('joinConversation', { conversationId }, (response) => {
      if (response?.success) {
        console.log(`Joined conversation: ${conversationId}`)
      } else {
        console.error('Failed to join conversation:', response?.error)
      }
      callback?.(response)
    })
  }

  leaveConversation(conversationId, callback) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }

    this.socket.emit('leaveConversation', { conversationId }, (response) => {
      if (response?.success) {
        console.log(`Left conversation: ${conversationId}`)
      }
      callback?.(response)
    })
  }

  sendMessage(conversationId, content, callback) {
    if (!this.socket?.connected) {
      console.error('Socket not connected')
      callback?.({ success: false, error: 'Socket not connected' })
      return
    }

    this.socket.emit(
      'sendMessage',
      { conversationId, content },
      (response) => {
        if (response?.success) {
          console.log('Message sent successfully')
        } else {
          console.error('Failed to send message:', response?.error)
        }
        callback?.(response)
      }
    )
  }

  onNewMessage(callback) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }

    this.socket.on('newMessage', callback)
    this.listeners.set('newMessage', callback)
  }

  offNewMessage() {
    if (this.socket && this.listeners.has('newMessage')) {
      const callback = this.listeners.get('newMessage')
      this.socket.off('newMessage', callback)
      this.listeners.delete('newMessage')
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners()
      this.listeners.clear()
    }
  }
}

export default new SocketService()
