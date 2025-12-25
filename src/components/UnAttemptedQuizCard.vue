<template>
  <div class="col-12 col-sm-6 col-md-4">
    <q-card class="rounded-xl">

      <!-- Body -->
      <q-card-section>
        <div class="text-body1 text-weight-medium">
          Algebra Practice Quiz
        </div>

        <div class="text-caption  q-mt-xs">
          Test your understanding of algebra fundamentals
        </div>

        <div class="row  q-gutter-sm q-mt-xs">

          <q-chip dense square flat text-color="black" class="text-caption ">
            Mathematics
          </q-chip>
          <q-chip dense color="orange" square flat text-color="white" class="text-caption ">
            Medium
          </q-chip>

          <q-chip dense text-color="black" class="text-caption ">
            20 Questions
          </q-chip>
          <q-chip dense text-color="black" class="text-caption ">
            Heighest Performer - 40%
          </q-chip>
          <q-chip dense text-color="black" class="text-caption ">
            ⏱ 30 mins
          </q-chip>
        </div>
      </q-card-section>

      <!-- <q-separator /> -->

      <!-- Actions -->
      <div class="q-pt-xs q-px-md q-pb-md ">
        <QuizAttemptModal />
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
