<template>
  <q-page class="q-px-md">

    <div class="row q-mt-xl">
      <LessonsTable></LessonsTable>
    </div>


  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import LessonsTable from 'src/components/teacher/LessonsTable.vue'
export default defineComponent({
  components: {
    LessonsTable
  },
  data() {
    return {
      panel: 'all'
    }
  },
  name: 'IndexPage',
})
</script>
