<script setup lang="ts">
import { store } from '../store.ts'
import Progress from './Progress.vue'
const props = defineProps({
  timerKey: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  duration: { type: Number, required: true },
  description: { type: String, required: false }
});
const emit = defineEmits(['done']);
function start() {
  if (store.timers[props.timerKey]) {
    return;
  }
  store.timers[props.timerKey] = { duration: props.duration, cb: () => emit("done") };
}
function style() {
  const percent = (store.timers[props.timerKey]?.time ?? 0) / props.duration * 100;
  const color = '#486';
  const bgColor = '#333';
  return {'background': `
    linear-gradient(
      to right,
      ${color}, ${percent}%, ${color}, ${percent}%, ${bgColor}, ${bgColor}
      ) no-repeat` };
}
</script>

<template>

  <div class="slow-button">
    <button @click="start()" :style="style()">
      <img v-bind:src="props.image"/>
      <div class="text">
        <div class="title">{{ props.title }}</div>
        <div class="description">
          {{ props.description }}
        </div>
      </div>
    </button>
  </div>

</template>

<style scoped></style>
