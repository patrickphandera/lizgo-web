<template>
  <q-page class="q-px-md">

    <div class="q-mt-sm text-h6">
      Dashboard
    </div>

    <!-- <AddLessonPage></AddLessonPage> -->

    <div class="row">
      <div class="col-12 col-md-8 col-lg-8">
        <div class="row">
          <LessonFirstCard v-for="lesson in lessons" :key="lesson.id" :lesson="lesson">

          </LessonFirstCard>
        </div>
        <div class="row">
          <ViewedLessons></ViewedLessons>
        </div>
      </div>

      <div class="col-12 col-md-4 col-lg-4">
        <AveragePerformance></AveragePerformance>
      </div>

    </div>
    <div class="text-h6 q-mx-md text-weight-bold">
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import LessonFirstCard from 'src/components/LessonRecentCard.vue'
// import AddLessonPage from '../components/AddLessonPage.vue'
import AveragePerformance from '../components/AveragePerformance.vue'
import lessonsService from 'src/services/lessons.service';
import ViewedLessons from '../components/ViewedLessons.vue'

export default defineComponent({
  components: {
    LessonFirstCard,
    ViewedLessons,
    AveragePerformance
    //  AddLessonPage
  },
  data() {
    return {
      panel: 'all',
      lessons: {}
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const lessons = await lessonsService.getAll()
        this.lessons = [lessons[0]]
      } catch (err) {
        console.log(err)
      }
    }
  },
  name: 'IndexPage',
})
</script>
