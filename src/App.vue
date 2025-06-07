<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Combat from './components/Combat.vue'
import Map from './components/Map.vue'
import Band from './components/Band.vue'
import { store } from './store.ts'

const animationFrameId = ref<number | null>(null);
const lastFrameTime = ref(performance.now());
const page = ref<'combat' | 'map' | 'band'>('combat');

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
  <div class="header">
    <div class="logo title">
      <img src="/images/generated/logo.png" alt="B" />ands
      <span style="color: #edb;">&nbsp;&&nbsp;</span>
      <img src="/images/generated/logo.png" alt="B" />onds
    </div>
    <div class="tabs">
      <button :class="{ selected: page === 'combat' }" @click="page = 'combat'">Fight</button>
      <button :class="{ selected: page === 'map' }" @click="page = 'map'">Map</button>
      <button :class="{ selected: page === 'band' }" @click="page = 'band'">Band</button>
    </div>
  </div>
  <div v-show="page === 'combat'">
    <Combat />
  </div>
  <div v-show="page === 'map'"><Map /></div>
  <div v-show="page === 'band'">
    <Band />
  </div>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  background-color: #000;
  padding: 10px;
  padding-bottom: 0;
  border-radius: 20px;
  overflow: hidden;
}

.tabs {
  display: flex;
  justify-content: space-around;

  button {
    display: inline-block;
    width: auto;
    background-color: transparent;
    border-radius: 0;
    padding: 5px 10px;
    font-size: 20px;
    border: none !important;
    outline: none !important;
    color: #bbb;
  }

  button:hover,
  button:focus,
  button.selected {
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-thickness: 1px;
  }

  button.selected {
    color: #edb;
  }
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  font-size: 35px;
  position: relative;
  padding: 0 30px;
}

.logo img {
  width: 60px;
  height: 60px;
  margin-left: -10px;
  margin-right: -10px;
}

.logo span {
  z-index: 1;
}
</style>
