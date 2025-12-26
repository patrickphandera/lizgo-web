<template>
  <q-page class="q-px-md ">

    <div class="q-mt-xs q-mb-md row no-wrap scroll-x q-gutter-md hide-scrollbar">
      <q-chip dense square color="primary shadow-2" class="text-white">All</q-chip>
      <q-chip dense square class="shadow-0"
        v-for="n in ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Science & Technology', 'Agriculture', 'Home Economics', 'Physics', 'Chemistry', 'Life Skills', 'French', 'Chichewa', 'Wood Work', 'Metal Work']"
        :key="n">
        {{ n }}
      </q-chip>
    </div>


    <div class="row q-gutter-md">
      <UnAttemptedQuizCard></UnAttemptedQuizCard>
      <CompletedQuizCard></CompletedQuizCard>
    </div>
<CreateQuizModal></CreateQuizModal>

  </q-page>
</template>
<script>
import { defineComponent, ref } from 'vue'
import UnAttemptedQuizCard from '../components/UnAttemptedQuizCard.vue'
import CompletedQuizCard from '../components/CompletedQuizCard.vue'
import CreateQuizModal from '../components/CreateQuizModal.vue'
export default defineComponent({
  name: 'QuizzesPage',
  components: { UnAttemptedQuizCard, CompletedQuizCard, CreateQuizModal },
  setup() {
    const panel = ref('available')


    const unattemptedCount = 6
    const completedCount = 3

    return {
      panel,
      unattemptedCount,
      completedCount
    }
  }
})
</script>
