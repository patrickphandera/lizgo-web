<template>
  <q-page class="q-px-md">

    <q-option-group class="text-caption" v-model="panel" inline :options="[
      { label: 'All', value: 'all' }, ,
      { label: 'Mathematics', value: 'Mathematics' },
      { label: 'English', value: 'English' },
      { label: 'Physics', value: 'Physics' },
      { label: 'Chemistry', value: 'Chemistry' },
      { label: 'Biology', value: 'Biology' },
      { label: 'Science & Technology', value: 's&t' },
      { label: 'Agriculture', value: 'Agriculture' },
      { label: 'Home Economics', value: 'h&e' },
      { label: 'French', value: 'French' },
    ]" />


    <div class="row">
      <LessonsTable></LessonsTable>
    </div>


  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import LessonsTable from '../components/teacher/LessonsTable.vue'
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
