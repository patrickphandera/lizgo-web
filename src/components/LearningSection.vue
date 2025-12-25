<template>
  <div>
    <q-card class="video shadow-0">
      <q-video black class="w-full video" :src="section.videoUrl" height="400px" />
    </q-card>
  </div>
</template>
<script>
export default {
  props: ['section', 'title'],
  data() {
    return {
      currentSection: 1
    }
  }
}
</script>
<style scoped>
.video {
  height: 450px;
}
</style>
