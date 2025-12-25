<template>
  <div class="col-12 col-sm-12 col-md-12">
    <q-card to="/lessons/123" class="q-ma-xs">

      <router-link :to="`/lessons/${lesson?.id}`" style="text-decoration: none; color: inherit;">
        <q-img :src="lesson?.thumbnail" height="140px">
          <div class="absolute-full text-subtitle2 flex flex-center">

          </div>
        </q-img>
      </router-link>

      <div>
        <q-card-section>

          <div class="flex q-my-xs row ">
            <div class="row q-gutter-sm">
              <div class="row items-center flex">

                <div class="text-body1 text-weight-medium ellipsis q-mr-sm">
                  {{
                    lesson?.title }}
                </div>
              </div>

            </div>
            <q-space></q-space>
            <q-btn elevated icon-right="mdi-play" color="primary" no-caps label="Resume" />
          </div>
          <q-linear-progress :value="0.4" class="q-mt-md" size="4px" />
        </q-card-section>
      </div>
    </q-card>

  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: ['lesson'],
  setup() {
    return {
      expanded: ref(false),
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  }
}
</script>
