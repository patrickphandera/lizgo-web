<template>
  <div class="col-12 col-sm-6 col-md-4">
    <q-card class="rounded-xl " bordered flat>

      <!-- BODY -->
      <q-card-section>
        <div class="text-body1 text-weight-medium">
          Solving Linear Equations
        </div>

        <div class="text-caption q-mt-xs">
          Let’s discuss different methods for solving linear equations
        </div>

        <!-- META -->
        <div class="row q-gutter-sm q-mt-md">

          <q-chip dense square flat class="text-caption">
            Mathematics
          </q-chip>

          <q-chip dense square flat color="green" text-color="white" class="text-caption">
            Open
          </q-chip>

          <q-chip dense flat class="text-caption">
            💬 18 Messages
          </q-chip>

          <q-chip dense flat class="text-caption">
            ⏱ Active 2h ago
          </q-chip>

        </div>
      </q-card-section>

      <!-- ACTIONS -->
      <div class="row items-center justify-between q-pa-sm">

        <div class="text-caption text-grey">
          Started by <b>Ms. Phiri</b>
        </div>

        <q-btn color="primary" unelevated dense icon="add" label="Join" class="text-capitalize" />
      </div>

    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DiscussionCard'
})
</script>
