<template>
  <div>

    <!-- Trigger button (optional, can remove) -->
    <q-btn unelevated color="primary" @click="open = true" class="text-capitalize full-width shadow-0"
      label="Start Quiz" />

    <!-- QUIZ MODAL -->
    <q-dialog v-model="open" persistent class="full-height full-width">
      <q-card style="width: 1200px; max-width: 100vw">

        <!-- Header -->
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">{{ quiz.title }}</div>
          <q-btn flat icon="close" @click="open = false" />
        </q-card-section>

        <q-separator />

        <!-- CONTENT -->
        <q-card-section>

          <!-- STEP 1 : RULES -->
          <div v-if="step === 1">
            <div class="text-subtitle1 text-weight-bold q-mb-md">
              Quiz Rules
            </div>

            <q-list bordered separator>
              <q-item v-for="(rule, i) in quiz.rules" :key="i">
                <q-item-section avatar>
                  <q-icon name="check_circle" color="primary" />
                </q-item-section>
                <q-item-section>
                  {{ rule }}
                </q-item-section>
              </q-item>
            </q-list>

            <q-checkbox v-model="acceptedRules" label="I understand and agree to the quiz rules" class="q-mt-md" />
          </div>

          <!-- STEP 2 : QUESTIONS -->
          <div v-if="step === 2">
            <div class="row items-center justify-between q-mb-md">
              <div class="text-subtitle1">
                Question {{ currentIndex + 1 }} of {{ quiz.questions.length }}
              </div>

              <q-badge color="primary">
                {{ remainingTime }} min left
              </q-badge>
            </div>

            <q-card flat bordered class="q-pa-md rounded-lg">
              <div class="text-body1 text-weight-medium q-mb-md">
                {{ currentQuestion.question }}
              </div>

              <q-option-group v-model="currentQuestion.answer" :options="currentQuestion.options" type="radio" />
            </q-card>
          </div>
          <!-- STEP 3 : RESULTS -->
          <div v-if="step === 3" class="q-pa-md">

            <div class="text-h5 text-weight-bold text-center q-mb-md">
              Quiz Results
            </div>

            <div class="row justify-center q-mb-lg">
              <q-circular-progress show-value size="120px" :value="percentage" color="primary" class="text-h6">
                {{ percentage }}%
              </q-circular-progress>
            </div>

            <div class="text-center text-subtitle1 q-mb-md">
              You scored <b>{{ score }}</b> out of <b>{{ quiz.questions.length }}</b>
            </div>

            <q-list bordered separator>
              <q-item v-for="(q, i) in quiz.questions" :key="i">
                <q-item-section>
                  <div class="text-weight-medium">
                    {{ i + 1 }}. {{ q.question }}
                  </div>
                  <div class="text-caption">
                    Your answer:
                    <span :class="q.answer === q.correct ? 'text-positive' : 'text-negative'">
                      {{ q.options[q.answer]?.label || 'Not answered' }}
                    </span>
                  </div>
                </q-item-section>

                <q-item-section side>
                  <q-icon :name="q.answer === q.correct ? 'check_circle' : 'cancel'"
                    :color="q.answer === q.correct ? 'positive' : 'negative'" />
                </q-item-section>
              </q-item>
            </q-list>

          </div>

        </q-card-section>

        <q-separator />

        <!-- ACTIONS -->
        <q-card-actions align="between">
          <q-btn flat no-caps label="Back" :disable="step === 1" @click="prevStep" />

          <q-btn color="primary" no-caps :disable="step === 1 && !acceptedRules" :label="actionLabel"
            @click="nextStep" />
        </q-card-actions>

      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/* MODAL STATE */
const open = ref(false)
const step = ref(1)
const acceptedRules = ref(false)

/* QUIZ TIMER */
const remainingTime = ref(30)

/* QUESTIONS */
const currentIndex = ref(0)

const quiz = ref({
  title: 'Algebra Practice Quiz',
  rules: [
    'You have 30 minutes to complete the quiz',
    'No pausing once the quiz starts',
    'Each question has one correct answer',
    'Submit before time runs out'
  ],
  questions: [
    {
      question: 'What is 5 + 3?',
      options: [
        { label: '6', value: 0 },
        { label: '7', value: 1 },
        { label: '8', value: 2 },
        { label: '9', value: 3 }
      ],
      answer: null
    },
    {
      question: 'What is 10 ÷ 2?',
      options: [
        { label: '2', value: 0 },
        { label: '5', value: 1 },
        { label: '10', value: 2 },
        { label: '20', value: 3 }
      ],
      answer: null
    }
  ]
})

const currentQuestion = computed(() => quiz.value.questions[currentIndex.value])

const actionLabel = computed(() => {
  if (step.value === 1) return 'Start Quiz'
  if (step.value === 2)
    return currentIndex.value === quiz.value.questions.length - 1
      ? 'Submit Quiz'
      : 'Next Question'
  return 'Close'
})


function nextStep() {
  if (step.value === 1) {
    step.value = 2
    return
  }

  if (step.value === 2) {
    if (currentIndex.value < quiz.value.questions.length - 1) {
      currentIndex.value++
    } else {
      submitQuiz()
    }
    return
  }

  if (step.value === 3) {
    open.value = false
  }
}


function prevStep() {
  if (step.value === 2 && currentIndex.value > 0) {
    currentIndex.value--
  } else {
    step.value = 1
  }
}

function submitQuiz() {
  console.log('QUIZ SUBMITTED:', quiz.value.questions)
  step.value = 3
}
</script>
