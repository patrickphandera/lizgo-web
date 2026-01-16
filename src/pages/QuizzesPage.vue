<template>
  <q-page class="q-px-md">
    <div class="q-mt-xs q-mb-md row no-wrap scroll-x q-gutter-md hide-scrollbar">
      <q-chip dense square color="primary shadow-2" class="text-white">All</q-chip>
      <q-chip
        dense
        square
        class="shadow-0"
        v-for="n in [
          'Mathematics',
          'English',
          'Physics',
          'Chemistry',
          'Biology',
          'Science & Technology',
          'Agriculture',
          'Home Economics',
          'Physics',
          'Chemistry',
          'Life Skills',
          'French',
          'Chichewa',
          'Wood Work',
          'Metal Work',
        ]"
        :key="n"
      >
        {{ n }}
      </q-chip>
    </div>
    <div class="row q-gutter-md">
      <QuizCard v-for="quiz in quizzes" v-bind:key="quiz.id" :quiz="quiz"></QuizCard>
    </div>
    <CreateQuizModal></CreateQuizModal>
  </q-page>
</template>
<script>
import { defineComponent, ref } from 'vue'
import QuizCard from '../components/QuizCard.vue'
import CreateQuizModal from '../components/CreateQuizModal.vue'
import quizzesService from '../services/quizzes.service'
export default defineComponent({
  name: 'QuizzesPage',
  components: { QuizCard, CreateQuizModal },
  data() {
    const panel = ref('available')

    const unattemptedCount = 6
    const completedCount = 3
    const quizzes = ref([])

    return {
      panel,
      unattemptedCount,
      completedCount,
      quizzes,
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.quizzes = await quizzesService.list()
    },
  },
})
</script>
