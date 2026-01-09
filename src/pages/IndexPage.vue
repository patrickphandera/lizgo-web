<template>
  <q-page class="row items-center">
    <!-- Hero Section -->
    <div class="q-px-lg q-mx-auto  ">
      <div class="row q-col-gutter-xl items-center">
        <!-- Text Content -->
        <div class="col-12 col-md-6">
        <div
  class="text-weight-bold text-black q-mb-sm text-h3  lt-md"
>
  Online Learning Platform for Your Syllabus
</div>

<div
  class="text-weight-bold text-black q-mb-sm text-h2  gt-sm"
>
  Online Learning Platform for Your Syllabus
</div>



          <p class="text-body1 q-mt-md">
            We have great courses taught by best teachers in Africa covering a variety of local
            syllabuses.
          </p>

          <div class="lt-sm row items-top bg-grey-3">
            <HomeLottie style="width: 100%; max-width: 400px" />
          </div>
          <div class="q-mt-xs q-mb-lg row q-gutter-md flex-wrap">
            <router-link :to="`/register`" style="text-decoration: none; color: inherit">
              <q-btn

                icon-right="mdi-arrow-top-right"
                color="primary"
                no-caps
                label="Start for free"
                class="text-subtitle2 q-py-sm q-px-md "
              />
            </router-link>
          </div>
        </div>

        <!-- Animation -->
        <div class="col-12 col-md-6 flex justify-end gt-sm ">
          <div class="bg-grey-3 bg-opacity-100 q-pa-xl rounded-borders">
          <HomeLottie style="width: 100%; max-width: 400px" />
          </div>
        </div>
      </div>
    </div>


  </q-page>
</template>

<script>
import HomeLottie from 'components/HomeLottie.vue'

export default {
  components: {
    HomeLottie,
  },
  data() {
    return {
        reasons: [
      {
        title: 'Local Syllabus Focus',
        description: 'Aligned with MSCE, JSCE, PSLCE & more.'
      },
      {
        title: 'Expert Teachers',
        description: 'Top educators from across Africa.'
      },
      {
        title: 'Affordable Access',
        description: 'Quality learning at low cost.'
      },
      {
        title: 'Interactive Lessons',
        description: 'Engaging videos, quizzes & notes.'
      }
    ],
      features: [
        { title: 'MSCE' },
        { title: 'JSCE' },
        { title: 'GSCE' },
        { title: 'PSLCE' },
      ],
    }
  },
}
</script>
