<template>
  <div class="col-12 col-sm-6 col-md-4">
    <q-card class="rounded-xl">
      <!-- Body -->
      <q-card-section>
        <div class="text-body1 text-weight-medium">
          {{ quiz.title }}
        </div>

        <div class="text-caption  q-mt-xs">
          {{ quiz.description }}
        </div>

        <div class="row  q-gutter-sm q-mt-xs">

          <q-chip dense square flat text-color="black" class="text-caption ">
            Mathematics
            {{ quiz.subjectId }}
          </q-chip>
          <q-chip dense color="orange" square flat text-color="white" class="text-caption ">
            Medium
          </q-chip>

          <q-chip dense text-color="black" class="text-caption ">

            {{ quiz.questions.length }} Questions
          </q-chip>
          <q-chip dense text-color="black" class="text-caption ">
            Heighest Performer - 40%
          </q-chip>
          <q-chip dense text-color="black" class="text-caption ">
            ⏱ {{ quiz.minutes }} mins
          </q-chip>
        </div>
      </q-card-section>

      <!-- <q-separator /> -->

      <!-- Actions -->
      <div class="q-pt-xs q-px-md q-pb-md ">
        <QuizAttemptModal :quiz="quiz" />
      </div>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import QuizAttemptModal from './TakeQuizModal.vue'
import { ref } from 'vue'
export default defineComponent({
  name: 'QuizCard',
  props: {quiz: Object},
  components: {
    QuizAttemptModal
  },
  setup() {
    return {
      showQuiz: ref(false)
    }
  }
})
</script>
