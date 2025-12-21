<!-- eslint-disable vue/valid-v-for -->
<template>
  <q-page class="q-mx-md q-mt-md ">

    <div class="text-h6 flex justify-between">
      <div class="flex">
        <router-link :to="`/lessons`" style="text-decoration: none; color: inherit;">
          <q-card style="width: 60px;" class="shadow-0">
            <q-btn icon="arrow_back" class="text-capitalize shadow-0" @click="$router.push({ path: '/lessons' })">

            </q-btn>
          </q-card>
        </router-link> <span class="q-mx-md text-center text-body1">Important of maize in Malawi’s economy</span>
      </div>
      <div>
        <q-btn color="primary " class="text-capitalize shadow-0" label="Add Credits"
          icon-right="add_shopping_cart"></q-btn>
      </div>

    </div>

    <div class="row q-my-md">
      <div class="col-10 q-pr-md">
        <q-card class="video shadow-0">


          <q-video black class="w-full video" src="/Emmie_Deebo_-_Muchile__Official_Music_Video_(720p).mp4"
            height="400px" />

          <q-card-section><span>SECTION 1 : Important of maize in Malawi’s economy</span></q-card-section>
        </q-card>
        <q-card bordered flat class="
            q-mt-md">
          <q-card-section class="text-h6">
            <div>
              Comments
            </div>

            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar2.jpg">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-input outlined v-model="text" class="q-mt-sm" label="New message" dense />

              </q-item-section>
            </q-item>
            <q-item v-for="i in [1, 2]" v-bind:key="i">
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar2.jpg">
                </q-avatar>
              </q-item-section>


              <q-item-section>
                <q-item-label caption>@PatrickPhandera</q-item-label>
                <q-item-label class="text-caption"> Maize is a crucial crop in Malawi, serving as both a staple food and
                  a key driver of the national economy. Its production supports the livelihoods of millions of
                  smallholder farmers and contributes significantly to food security. Understanding the importance of
                  maize helps in promoting sustainable agricultural practices and shaping policies that strengthen
                  Malawi’s agricultural sector.</q-item-label>

              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <q-card class="col-2 q-px-md shadow-0" bordered>
        <q-timeline color="primary">
          <q-timeline-entry icon="check" class="text-capitalize" subtitle="Section 1">
            <template v-slot:subtitle>
              <div class="text-body2 text-capitalize text-black">
                Section Title
              </div>
            </template>
            <div>
              Important of maize in Malawi’s economy
            </div>
          </q-timeline-entry>

          <q-timeline-entry subtitle="Section 2" icon="lock">
            <template v-slot:subtitle>
              <div class="text-body2 text-capitalize text-black">
                Section Title
              </div>
            </template>
            <div>
              Important of maize in Malawi’s economy.
            </div>
          </q-timeline-entry>



          <q-timeline-entry icon="lock" subtitle="Section 3">
            <template v-slot:subtitle>
              <div class="text-body2 text-capitalize text-black">
                Section Title
              </div>
            </template>
            <div>
              Important of maize in Malawi’s economy.
            </div>
          </q-timeline-entry>
          <q-timeline-entry icon="lock" subtitle="Section 3">
            <template v-slot:subtitle>
              <div class="text-body2 text-capitalize text-black">
                Section Title
              </div>
            </template>
            <div>
              Important of maize in Malawi’s economy.
            </div>
          </q-timeline-entry>
          <q-timeline-entry icon="lock" subtitle="Section 3">
            <template v-slot:subtitle>
              <div class="text-body2 text-capitalize text-black">
                Section Title
              </div>
            </template>
            <div>
              Important of maize in Malawi’s economy.
            </div>
          </q-timeline-entry>
        </q-timeline>
      </q-card>


    </div>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'IndexPage',
})
</script>
<style scoped>
.video {
  height: 450px;
}
</style>
