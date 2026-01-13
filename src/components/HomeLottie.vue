<template>
  <div ref="lottieContainer" style="height: 400px;"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import lottie from 'lottie-web'
import animationData from '../assets/lottie/home.json'

const lottieContainer = ref(null)
let animation = null

onMounted(() => {
  animation = lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData
  })
})

onBeforeUnmount(() => {
  animation?.destroy()
})
</script>
