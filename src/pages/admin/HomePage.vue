<template>
  <q-page class="">




    <div class="q-mx-sm q-mt-xs row no-wrap scroll-x q-gutter-md hide-scrollbar">
      <q-chip square color="primary shadow-2" class="text-white">All</q-chip>
      <q-chip square class="shadow-0"
        v-for="n in ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Science & Technology', 'Agriculture', 'Home Economics', 'Physics', 'Chemistry', 'Life Skills', 'French', 'Chichewa', 'Wood Work', 'Metal Work']"
        :key="n">
        {{ n }}
      </q-chip>
    </div>



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
import LessonFirstCard from '../components/LessonFirstCard.vue'
export default defineComponent({
  components: {
    LessonFirstCard,
  },
  name: 'IndexPage',
})
</script>
