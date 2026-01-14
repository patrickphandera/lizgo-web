<template>
  <q-page class="q-ma-md">
    <q-card class="q-pa-md row justify-between"><div  class="column">

      <div class="text-h6 text-weight-bold ">
         Welcome back
      </div>
      <div>
         Welcome back
      </div>
    </div> <div class="row items-center" ><img style="width: 40px;" src="/fire.png"></div></q-card>
    <div class="row q-mt-md q-col-gutter-md grid-auto">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Soil fertility and management</div>
            <div class="">Soil fertility and management</div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <q-chip color="grey-2" dense class="text-caption"
              > <q-icon name="mdi-check-circle"></q-icon
            >Soil fertility and management</q-chip>
            <q-chip dense color="grey-2" class="text-caption"
              > <q-icon name="mdi-check-circle"></q-icon
            >Soil fertility and management</q-chip>
            <q-chip color="grey-2" dense class="text-caption"
              ><q-icon name="mdi-check-circle"></q-icon
            >Soil fertility and management </q-chip>
            <q-chip color="grey-2" dense class="text-caption"
              ><q-icon name="mdi-check-circle"></q-icon
            >Soil fertility and management </q-chip>

            <q-chip color="grey-2" dense class="text-caption"
              ><q-icon name="mdi-pause"></q-icon
            >Soil fertility </q-chip>
          </q-card-section>
          <!-- <img src="/ezekiel-nuhu-LhxRIFcdX2E-unsplash.jpg" height="200px" width="auto" alt="" /> -->
          <q-card-section>
            <q-btn
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
export default {
  components: {
    ProgressOverTimeChart,
    SubjectScoresBarChart,
    RecentLesson,
  },
  data() {
    return {
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
}
</script>
