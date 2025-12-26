<template>
  <q-page class="q-pa-md">
    <PersonalChat conversation-id="UUID-OF-CONVERSATION" />
    <div class="text-h6 flex justify-between">
      <div class="flex">
        <router-link :to="`/quizzes`" style="text-decoration: none; color: inherit;">
          <q-card dense style="width: 60px;" class="shadow-0">
            <q-btn dense icon="arrow_back" class="text-capitalize shadow-0 q-px-md"
              @click="$router.push({ path: '/quizzes' })">

            </q-btn>
          </q-card>
        </router-link> <span class="q-mx-md text-center text-body1">
          Agriculture form 3 chanco quiz</span>
      </div>
      <div>
        <q-chip dense square>Average Score - 98%</q-chip>
      </div>

    </div>
    <!-- Subject Filter -->


    <div class="q-my-sm row q-px-xs no-wrap scroll-x q-gutter-md hide-scrollbar">
      <q-chip square dense color="primary shadow-2" class="text-white">All</q-chip>
      <q-chip square class="shadow-0" dense v-for="n in ['Completed', 'Not completed']" :key="n">
        {{ n }}
      </q-chip>
    </div>

    <div class="row q-gutter-md">
      <UnAttemptedQuizCard></UnAttemptedQuizCard>
      <CompletedQuizCard></CompletedQuizCard>
    </div>



  </q-page>
</template>
<script>
  import PersonalChat from '../components/PersonalChat.vue'
import { defineComponent, ref } from 'vue'
import UnAttemptedQuizCard from '../components/UnAttemptedQuizCard.vue'
import CompletedQuizCard from '../components/CompletedQuizCard.vue'
export default defineComponent({
  name: 'QuizzesPage',
  components: { UnAttemptedQuizCard, CompletedQuizCard,PersonalChat },
  setup() {
    const panel = ref('available')

    // replace with API data later
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
