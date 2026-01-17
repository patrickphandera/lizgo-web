<template>
  <div>
    <div v-if="section?.type === 'video'">
      <q-card class="video shadow-0">
        <q-video black class="w-full video" :src="section.videoUrl" height="400px" />
      </q-card>
    </div>

    <div v-if="section?.type === 'quiz'">
      <div class="">
        <!-- Show score only after checking -->
        <div v-if="showResults" class="text-center q-mb-md">
          <q-badge color="primary" class="text-h6">
            Score: {{ scorePercent }}%
          </q-badge>
        </div>

        <q-card
          v-for="(question, qIndex) in section.quiz?.questions"
          :key="qIndex"
          class="q-my-md"
        >
          <div class="q-pa-md">
            <h4 class="text-h6">{{ question?.title }}</h4>

            <q-option-group
              v-model="selectedAnswers[qIndex]"
              :options="formattedOptions(question?.options)"
              color="primary"
              type="radio"
              :disable="showResults"
            />

            <!-- Feedback shown ONLY after "Check Answers" is clicked -->
            <q-banner v-if="showResults" class="q-mt-sm" dense>
              <template v-if="isCorrect(qIndex)">
                <span class="text-green">✅ {{ question?.gradingNote || 'Correct!' }}</span>
              </template>
              <template v-else>
                <span class="text-red">❌ Not quite. The correct answer was: {{ getCorrectAnswerText(question) }}</span>
              </template>
            </q-banner>
          </div>
        </q-card>

        <div class="row justify-center q-mt-md q-gutter-md">
          <q-btn
          v-if="scorePercent &&scorePercent<50"
            label="Re-do"
            color="primary"
            @click="checkAnswers"
            :disable="isQuizAttempted"
          />
          <q-btn
          v-if="!scorePercent"
            label="Check Answers"
            color="primary"
            @click="checkAnswers"
            :disable="isQuizAttempted"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    section: {
      type: Object,
      required: true,
    },
  },
  data() {
    const questions = this.section?.quiz?.questions || []
    return {
      questions,
      selectedAnswers: {},
      showResults: false, // controls when to show feedback & score
    }
  },
  computed: {
    // Check if at least one question has been answered
    isQuizAttempted() {
      return Object.keys(this.selectedAnswers).length === 0
    },

    // Calculate score percentage
    scorePercent() {
      if (!this.showResults) return 0
      const questions = this.section?.quiz?.questions || []
      if (questions.length === 0) return 0

      let correctCount = 0
      questions.forEach((_, index) => {
        if (this.isCorrect(index)) correctCount++
      })

      return Math.round((correctCount / questions.length) * 100)
    }
  },
  methods: {
    formattedOptions(options = []) {
      return options.map((label, index) => ({
        label,
        value: index,
      }))
    },

    isCorrect(qIndex) {
      const question = this.section?.quiz?.questions?.[qIndex]
      if (!question || !Array.isArray(question.correctOptionIndexes)) return false
      const correctIndex = question.correctOptionIndexes[0]
      return this.selectedAnswers[qIndex] === correctIndex
    },

    getCorrectAnswerText(question) {
      const correctIndex = question.correctOptionIndexes[0]
      return question.options[correctIndex] || '—'
    },

    checkAnswers() {
      this.showResults = true
      console.log('Final answers:', this.selectedAnswers)
      console.log('Score:', this.scorePercent + '%')
    }
  }
}
</script>

<style scoped>
.video {
  height: 450px;
}
.text-green {
  color: #4caf50;
}
.text-red {
  color: #f44336;
}
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
