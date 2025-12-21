<template>
  <q-item class="row">
    <router-link :class="route.path === link ? 'bg-primary text-white q-pa-xs' : 'bg-grey-1'" class="row  items-center justify-between q-px-md" :to="`${link}`" style="text-decoration: none; color: inherit;width: 150px;">
     <div >{{ title }}</div>
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
