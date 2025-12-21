<template>
  <div class="col-12 col-sm-6 col-md-4">

    <q-card to="/lessons/123" clickable class="q-ma-sm shadow-1">
      <router-link :to="`/lessons/hhwhw`" style="text-decoration: none; color: inherit;">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" height="140px">
          <div class="absolute-full text-subtitle2 flex flex-center">

          </div>
        </q-img>
      </router-link>

      <div>
        <q-card-section>
          <div class="row items-center flex">

            <div class="text-body1 text-weight-medium ellipsis q-mr-sm">

              Importance of maize in Malawi’s economy
            </div>




            <!-- <q-space /> -->

            <!-- <q-btn flat round dense icon="more_vert" /> -->

          </div>
          <!-- <div class="row items-center q-gutter-sm">

            <q-avatar size="40px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" width="30px">
            </q-avatar>


            <div class="column">
              <div class="text-caption">Patrick Phandera</div>
              <div class="text-caption">Teacher | <span>30k followers</span></div>
            </div>

          </div> -->

          <div class="text-caption flex">
            <q-chip square class="text-caption " dense>MSCE</q-chip>
            <q-chip square class="text-caption" dense>Agriculture </q-chip>
            <q-chip square class="text-caption" dense>Book 3 </q-chip>
            <q-chip square class="text-caption " dense>Topic 5</q-chip>
            <q-chip square class="text-caption " dense>30K Views</q-chip><q-chip square class="text-caption " dense>5

              Hours Ago</q-chip>
          </div>


          <div class="flex q-my-xs row ">
            <div class="row q-gutter-sm">
              <q-avatar size="40px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
              <div class="column">
                <div square class="text-caption " dense>Patrick Phandera</div>
                <div square class="text-caption text-grey-8" dense>30k Followers</div> <q-space />
              </div>
            </div>

            <q-space></q-space>
            <q-btn flat round dense icon="more_vert" />

          </div>

          <div class="text-caption flex">

          </div>





        </q-card-section>

      </div>

    </q-card>


  </div>

</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    return {
      expanded: ref(false),
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  }
}
</script>
