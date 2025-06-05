<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Combat from './components/Combat.vue'
import { attacks, store } from './store.ts'

const animationFrameId = ref<number | null>(null);
const lastFrameTime = ref(performance.now());

function mainLoop() {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastFrameTime.value;
  if (deltaTime > 100) { console.log('catching up:', deltaTime); }
  for (const name of Object.keys(store.attackTimers)) {
    const attack = attacks[name];
    store.attackTimers[name] += Math.floor(deltaTime);
    if (store.attackTimers[name] >= attack.duration * 1000) {
      store.damage += attack.damage;
      delete store.attackTimers[name];
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

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
