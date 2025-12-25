<template>
  <div class="col-12 col-sm-6 col-md-4">
    <q-card to="/lessons/123" clickable class="q-my-sm shadow-1">
      <router-link :to="`/lessons/${lesson?.id}`" style="text-decoration: none; color: inherit;">
        <q-img :src="lesson?.thumbnail" height="140px">
          <div class="absolute-full text-subtitle2 flex flex-center">

          </div>
        </q-img>
      </router-link>

      <div>
        <q-card-section>
          <div class="row items-center flex">

            <div class="text-body1 text-weight-medium ellipsis q-mr-sm">
              {{
                lesson?.title }}
            </div>
          </div>
          <div class="text-caption flex">
            <q-chip square class="text-caption " dense>{{
              lesson?.curriculumId?.title }}</q-chip>
            <q-chip square class="text-caption" dense>{{
              lesson?.subjectId?.title }} </q-chip>
            <q-chip square class="text-caption" dense v-if="lesson?.book">{{
              lesson?.book }} </q-chip>
            <q-chip square class="text-caption " dense>{{
              lesson?.topicId.title }}</q-chip>
            <!-- <q-chip square class="text-caption " dense>30K Views</q-chip> -->

            <q-chip square class="text-caption " dense>
              {{ lesson?.timeAgo }}</q-chip>
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
