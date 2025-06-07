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
  <div class="logo title">
    <img src="/images/logo.png" alt="B" />ands
    <span style="color: #edb;">&nbsp;&&nbsp;</span>
    <img src="/images/logo.png" alt="B" />onds
  </div>
  <Combat />
</template>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  padding: 10px 0px;
  border-radius: 20px;
  overflow: hidden;
  font-size: 30px;
}

.logo img {
  width: 60px;
  height: 60px;
  margin-right: -10px;
}
</style>
