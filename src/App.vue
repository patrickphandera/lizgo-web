<template>
  <router-view />
</template>

<script>
  import { useAuthStore } from './stores/auth'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const authStore = useAuthStore()
    authStore.restore()
  }
})
</script>
