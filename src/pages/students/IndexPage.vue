<template>
  <q-page class="q-ma-md">
    <q-card class="q-pa-md row justify-between"
      ><div class="column">
        <div class="text-h6 text-weight-bold">Welcome back</div>
        <div>Welcome back</div>
      </div>
      <div class="row items-center"><img style="width: 40px" src="/fire.png" /></div
    ></q-card>
    <div class="row q-mt-xs q-col-gutter-md grid-auto">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ userLesson?.lessonId?.title }}</div>
            <div class="">{{ userLesson?.lessonId?.description }}</div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="">
            <q-chip
              color="grey-2"
              dense
              class="text-caption"
              v-for="section in coveredLessons"
              v-bind:key="section"
            >
              <q-icon name="mdi-check-circle"></q-icon>{{ section }}</q-chip
            >
             <q-chip
              color="grey-2"
              dense
              class="text-caption"
              v-for="section in unCoveredLessons"
              v-bind:key="section"
            >
              <q-icon name="mdi-circle-outline"></q-icon>{{ section }}</q-chip
            >
          </q-card-section>
          <!-- <img src="/ezekiel-nuhu-LhxRIFcdX2E-unsplash.jpg" height="200px" width="auto" alt="" /> -->
          <q-card-section class="q-mt-lg">
            <q-btn
              @click="$router.push({ path: `/students/lessons/${userLesson?.lessonId?._id}` })"
              color="primary"
              icon-right="mdi-play"
              class="text-capitalize full-width"
              full-width
              label="Resume"
              square
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Soil fertility and management</div>
            <div class="">Soil fertility and management</div>
          </q-card-section>
          <q-separator></q-separator>
          <subject-scores-bar-chart :scores="studentScores" />
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <RecentLesson></RecentLesson>
      </div>
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Soil fertility and management</div>
            <div class="">Soil fertility and management</div>
          </q-card-section>
          <q-separator></q-separator>
          <ProgressOverTimeChart :progress-data="weeklyScores"></ProgressOverTimeChart>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
import SubjectScoresBarChart from 'components/student/SubjectScoresBarChart.vue'
import ProgressOverTimeChart from 'components/student/ProgressOverTimeChart.vue'

import RecentLesson from 'components/student/RecentLesson.vue'
import userLessonsService from 'src/services/user.lessons.service'
export default {
  components: {
    ProgressOverTimeChart,
    SubjectScoresBarChart,
    RecentLesson,
  },
  data() {
    return {
      unCoveredLessons: [],
      coveredLessons: [],
      userLesson: {},
      weeklyScores: [
        { date: '2026-01-01', avgScore: 70 },
        { date: '2026-01-08', avgScore: 75 },
        { date: '2026-01-15', avgScore: 82 },
        { date: '2026-01-22', avgScore: 88 },
        { date: '2026-01-29', avgScore: 91 },
      ],
      studentScores: [
        { subject: 'Mathematics', avgScore: 88 },
        { subject: 'Physics', avgScore: 76 },
        { subject: 'Chemistry', avgScore: 92 },
        { subject: 'Biology', avgScore: 85 },
        { subject: 'History', avgScore: 79 },
        { subject: 'Literature', avgScore: 83 },
      ],
    }
  },
  async created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      let latestUserLesson = await userLessonsService.get('me/latest')
      this.userLesson = latestUserLesson

       this.coveredLessons = latestUserLesson.sections.map(s => s.title);

    // Titles of all sections in the lesson
    const allLessonTitles = latestUserLesson.lessonId.sections.map(s => s.title);

     this.unCoveredLessons = allLessonTitles.filter(
      title => !this.coveredLessons.includes(title)
    );
    },
  },
}
</script>
