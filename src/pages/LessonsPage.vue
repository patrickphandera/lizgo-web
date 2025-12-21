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
    <AddLessonPage></AddLessonPage>

    <div class="row">
      <LessonFirstCard v-for="n in 3" :key="n"></LessonFirstCard>
    </div>
    <div class="text-h6 q-mx-md text-weight-bold">
    </div>
    <div class="row">
      <LessonFirstCard v-for="n in 3" :key="n"></LessonFirstCard>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import LessonFirstCard from 'src/components/LessonFirstCard.vue'
import AddLessonPage from '../components/AddLessonPage.vue'
export default defineComponent({
  components: {
    LessonFirstCard, AddLessonPage
  },
  data() {
    return {
      panel: 'all'
    }
  },
  name: 'IndexPage',
})
</script>
