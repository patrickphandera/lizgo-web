<template>
  <q-page class="">

    <div class=" q-px-lg">
      <q-card-section horizontal>
        <q-card-section class="col-6 q-mt-xl ">
          <!-- <div class="text-overline">Local Curricula</div> -->
          <div class="text-h5   q-mb-xs">
            <div class="text-h2 text-weight-bold q-mb-sm  shadow-0">
              <span class="text-black">Great</span> learners <span class="text-black">learn</span> from the
              #best.
            </div>
          </div>
          <div class="text-body1 q-mt-xs q-pr-xl">
            We have great courses taught by best teachers in Africa covering a varienty of local syllubus.
          </div>
          <div class="q-mt-sm q-mb-lg row q-gutter-md">
            <router-link :to="`/register`" style="text-decoration: none; color: inherit;">
              <q-btn unelevated rounded class="shadow-0  text-subtitle q-pa-md q-px-lg" icon-right="mdi-arrow-top-right"
                color="primary " no-caps><span>Join
                  for
                  free</span></q-btn>
            </router-link> <router-link :to="`/register`" style="text-decoration: none; color: inherit;">
              <q-btn rounded unelevated class="shadow-0 text-black  text-subtitle q-pa-md q-px-lg"
                icon-right="chevron_right" color="grey-3 " no-caps><span>Courses</span></q-btn>
            </router-link>
          </div>

          <!-- <div class="row q-gutter-md ">



            <q-badge color="grey-4 q-pa-md shadow-0" text-color="black">
              MSCE <q-icon name="mdi-check-circle" class="q-ml-sm"></q-icon>
            </q-badge>
            <q-badge color="grey-4  q-pa-md shadow-0 " text-color="black">
              JCE <q-icon name="mdi-check-circle" class="q-ml-sm"></q-icon>
            </q-badge>
            <q-badge color="grey-4  q-pa-md shadow-0" text-color="black">
              GSCE <q-icon name="mdi-check-circle" class="q-ml-sm"></q-icon>
            </q-badge>

            <q-badge color="grey-4  q-pa-md shadow-0" text-color="black">
              PSLCE <q-icon name="mdi-check-circle" class="q-ml-sm"></q-icon>
            </q-badge>


          </div> -->

        </q-card-section>

        <q-card-section class="col-6 ">

          <HomeLottie></HomeLottie>
        </q-card-section>
      </q-card-section>
    </div>
    <div class="row q-mb-md q-px-lg q-mx-sm">
      <div class="col-3">
        <q-card class=" q-pa-xl q-ma-xs row justify-between">
          Decipline <div>
            <img src="/fire.png" alt="" height="20px">
          </div>
        </q-card>
      </div>
      <div class="col-3">
        <q-card class=" q-pa-xl q-ma-xs row justify-between">
          Hard working<div>
            <img src="/fire.png" alt="" height="20px">
          </div>
        </q-card>
      </div>
      <div class="col-3">
        <q-card class=" q-pa-xl q-ma-xs row justify-between ">
          Result oriented<div>
            <img src="/fire.png" alt="" height="20px">
          </div>
        </q-card>
      </div>
      <div class="col-3">
        <q-card class=" q-pa-xl q-ma-xs">
          <div class="row justify-between">
            Innovative<div>
              <img src="/fire.png" alt="" height="20px">
            </div>
          </div>
        </q-card>
      </div>

    </div>
  </q-page>
</template>
<script>
import { ref } from 'vue'
import HomeLottie from 'components/HomeLottie.vue'
export default {
  components: {
    HomeLottie
  },
  setup() {
    return {
      slide: ref('first')
    }
  }
}
</script>
<style lang="sass" scoped>
.custom-caption
  text-align: center
  padding: 12px
  color: white
  background-color: rgba(0, 0, 0, .3)
.overlapping
  border: 2px solid white
  position: absolute
</style>
