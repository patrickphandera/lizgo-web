<template>
  <q-item class="row justify-center">

    <router-link :to="`${link}`" style="text-decoration: none; color: inherit;">
      <q-btn unelevated round :icon="icon" :class="route.path === link ? 'text-white' : 'text-black'"
        :color="route.path === link ? 'primary' : 'grey-1'" />
    </router-link>
  </q-item>
</template>

<script>
import { useRoute } from 'vue-router'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    link: {
      type: String,
      default: '#',
    },

    icon: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      route: useRoute(),
    }
  }
})
</script>
