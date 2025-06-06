<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Combat from './components/Combat.vue'
import { store } from './store.ts'

const animationFrameId = ref<number | null>(null);
const lastFrameTime = ref(performance.now());

function mainLoop() {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastFrameTime.value;
  if (deltaTime > 100) { console.log('catching up:', deltaTime); }
  for (const [key, t] of Object.entries(store.timers)) {
    t.time ??= 0;
    t.time += Math.floor(deltaTime);
    if (t.time >= t.duration) {
      t.cb?.(t);
      delete store.timers[key];
    }
  }
  lastFrameTime.value = currentTime;
  animationFrameId.value = requestAnimationFrame(mainLoop);
}

onMounted(() => {
  animationFrameId.value = requestAnimationFrame(mainLoop);
});

onUnmounted(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }
});
</script>

<template>
  <Combat />
</template>

<style scoped></style>
