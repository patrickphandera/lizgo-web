<template>
  <div class="col-12 col-sm-6 col-md-4">
    <q-card clickable class="q-my-sm shadow-0" bordered>
      <router-link
        :to="`/students/lessons/${lesson?.id}`"
        style="text-decoration: none; color: inherit"
      >
        <q-img :src="lesson?.thumbnail" height="140px">
          <div class="absolute-full text-subtitle2 flex flex-center"></div>
        </q-img>
      </router-link>

      <div>
        <div class="row items-center flex">
          <div class="text-body1 text-weight-medium ellipsis q-px-sm">
            {{ lesson?.title }}
          </div>
            <div class="text-caption  ellipsis q-px-sm">
            {{ lesson?.description }}
          </div>
        </div>
        <div class="text-caption flex q-px-xs">
          <q-chip square class="text-caption" dense>{{ lesson?.curriculumId?.title }}</q-chip>
          <q-chip square class="text-caption" dense>{{ lesson?.subjectId?.title }} </q-chip>
          <q-chip square class="text-caption" dense v-if="lesson?.book">{{ lesson?.book }} </q-chip>
          <q-chip square class="text-caption" dense>{{ lesson?.topicId.title }}</q-chip>
          <!-- <q-chip square class="text-caption " dense>30K Views</q-chip> -->

          <q-chip square class="text-caption" dense> {{ lesson?.timeAgo }}</q-chip>
        </div>
        <div class="flex q-my-xs row q-pa-sm">
          <div class="row q-gutter-xs items-center">
            <q-avatar size="30px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="column">
              <div square class="text-caption text-capitalize" dense>{{ lesson.authorId?.firstName }} {{ lesson.authorId?.lastName }}</div>

              <q-space />
            </div>
            <q-chip  square class="text-caption" dense>30k <q-icon name="mdi-account-multiple"></q-icon></q-chip>
          </div>
          <q-space></q-space>
          <div>
            <q-btn flat round dense icon="more_vert" />
          </div>
        </div>
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
      lorem:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    }
  },
}
</script>
