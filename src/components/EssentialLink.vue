<template>
  
      <q-item clickable v-ripple>
          <q-item-section avatar>
          <q-icon  :name="icon" />
        </q-item-section>
        <q-item-section>
          {{ title }}
        </q-item-section>
       
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
  },
  computed: {
    isActive() {
      // Check if current path starts with the link
      return this.route.path.startsWith(this.link)
    }
  }
})
</script>