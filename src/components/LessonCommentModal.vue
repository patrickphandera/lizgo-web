<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn @click="openModal" class="text-capitalize">
      <q-icon name="mdi-message-badge-outline" size="24px" />
      {{ messages.length }} Comments
    </q-btn>
    <q-dialog v-model="fixed" persistent full-width full-height>
      <q-card class="column no-wrap" style="height: 100%">
        <!-- Header -->
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">Messages</div>
          <q-btn flat dense icon="close" @click="closeModal" />
        </q-card-section>

        <q-separator />

        <!-- Scrollable Messages Area -->
        <q-card-section class="col scroll" style="min-height: 0">
          <q-item
            v-for="message in messages"
            :key="message._id"
            class="bg-grey-2 q-mt-sm"
            style="border-radius: 10px"
            >
            <q-item-section avatar>
              <q-avatar size="40px">
                <img
                  :src="message.sender?.avatar || 'https://cdn.quasar.dev/img/avatar2.jpg'"
                  style="width: 100%; height: 100%; object-fit: cover"
                  @error="$event.target.src = 'https://cdn.quasar.dev/img/avatar2.jpg'"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-caption text-grey-9">
                @{{ message.senderUser.firstName + ' ' + message.senderUser.lastName || 'Unknown' }}
              </q-item-label>
              <q-item-label class="text-caption">
                {{ message.content }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label caption class="text-caption text-grey-9">
                {{ message.timeAgo }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Loading -->
          <div v-if="loading" class="text-center q-pa-md">
            <q-spinner color="primary" size="3em" />
          </div>

          <!-- Empty State -->
          <div v-else-if="messages.length === 0" class="text-center q-pa-md text-grey">
            No messages yet. Be the first to comment!
          </div>
        </q-card-section>

        <q-separator />

        <!-- Message Input -->
        <q-card-actions class="q-pa-md">
          <q-input
            v-model="newMessage"
            label="Write Message.."
            outlined
            class="full-width"
            :disable="!socketConnected || sending"
            :loading="sending"
            @keyup.enter.exact="sendMessage"
          >
            <template #append>
              <q-btn
                flat
                color="primary"
                icon="mdi-send"
                :disable="!newMessage.trim() || !socketConnected"
                :loading="sending"
                @click="sendMessage"
              />
            </template>
          </q-input>
        </q-card-actions>

        <!-- Connection Status -->
        <div v-if="!socketConnected" class="bg-negative text-white q-pa-sm text-center">
          <q-icon name="warning" /> Disconnected – Reconnecting...
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, onUnmounted } from 'vue'
import { Notify } from 'quasar'
import socketService from '../services/socket.service'
import conversationsService from 'src/services/conversations.service'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  conversationId: {
    type: String,
    required: true,
  },
})

const authStore = useAuthStore()

const fixed = ref(false)
const messages = ref([])
const newMessage = ref('')
const loading = ref(false)
const sending = ref(false)
const socketConnected = ref(false)

// ─── Helpers ────────────────────────────────────────

// ─── Load Messages ──────────────────────────────────
const loadMessages = async () => {
  loading.value = true
  try {
    // Join conversation (idempotent API call)
    await conversationsService.joinConversation(props.conversationId)
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/conversations/${props.conversationId}/messages`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    )

    messages.value = res.data.messages.reverse() || []

  } catch (err) {
    console.error('Failed to load messages:', err)
    Notify.create({ message: 'Failed to load comments', color: 'negative' })
  } finally {
    loading.value = false
  }
}

// ─── Send Message ───────────────────────────────────
const sendMessage = () => {
  const content = newMessage.value.trim()
  if (!content || sending.value) return

  sending.value = true
  socketService.sendMessage(props.conversationId, content, (response) => {
    sending.value = false
    if (response?.success) {
      console.log(response.message)
      messages.value.push(response.message)
      newMessage.value = ''
    } else {
      console.log(response)
      Notify.create({ message: 'Failed to send message', color: 'negative' })
    }
  })
}

// ─── Handle Incoming Messages ───────────────────────
const handleNewMessage = (data) => {
  if (data.conversationId !== props.conversationId) return

  const exists = messages.value.some((m) => m._id === data.message._id)
  if (!exists) {
    messages.value.push(data.message)
  }
}

// ─── Modal Control ──────────────────────────────────
const openModal = async () => {
  fixed.value = true
  await loadMessages()
}

const closeModal = () => {
  fixed.value = false
  socketService.leaveConversation(props.conversationId)
}

// ─── Lifecycle ──────────────────────────────────────
onMounted(() => {
  const token = authStore.token
  if (!token) return

  socketService.connect(token)
  socketConnected.value = socketService.isConnected()
  socketService.onNewMessage(handleNewMessage)

  // Connection status sync
  const socket = socketService.socket
  if (socket) {
    socket.on('connect', () => {
      socketConnected.value = true
    })
    socket.on('disconnect', () => {
      socketConnected.value = false
    })
  }
})

onUnmounted(() => {
  socketService.offNewMessage()
  socketService.leaveConversation(props.conversationId)
})
</script>
