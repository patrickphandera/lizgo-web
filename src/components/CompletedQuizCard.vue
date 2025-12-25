<template>
  <div class="col-12 col-sm-6 col-md-4">
    <q-card class="rounded-xl">

      <!-- Body -->
      <q-card-section>
        <div class="text-body1 text-weight-medium ">
          Algebra Practice Quiz
        </div>

        <div class="text-caption  q-mt-xs">
          Test your understanding of algebra fundamentals
        </div>

        <div class="row  q-gutter-sm q-mt-sm">

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
            ⏱ 30 mins
          </q-chip>
          <q-chip square dense>
            <div class="text-caption">
              Top Performer : 60%
            </div>
          </q-chip>
          <q-chip square dense>
            <div class="text-caption">
              Your score : 60%
            </div>
          </q-chip>
        </div>
      </q-card-section>

      <!-- <q-separator /> -->

      <!-- Actions -->
      <div class="row q-pb-md q-px-md row justify-left">
        <div class="text-body1">

        </div>
        <q-btn unelevated icon="refresh" color="primary" class="text-capitalize text-caption" label="Retake" />
      </div>

    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'QuizCard'
})
</script>
