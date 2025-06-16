<script setup lang="ts">
import { computed } from 'vue';
import { store } from '../store.ts';
import { marked } from 'marked';
const props = defineProps({
  timerKey: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  duration: { type: Number, required: false },
  description: { type: String, required: false }
});
const emit = defineEmits(['done']);
function start() {
  if (!props.duration || store.run.timers[props.timerKey]) {
    return;
  }
  store.run.timers[props.timerKey] = { duration: props.duration, cb: () => emit("done") };
}
function style() {
  if (!props.duration) {
    return {};
  }
  const percent = (store.run.timers[props.timerKey]?.time ?? 0) / props.duration * 100;
  const color = '#486';
  const bgColor = '#333';
  return {
    'background': `
    linear-gradient(
      to right,
      ${color}, ${percent}%, ${color}, ${percent}%, ${bgColor}, ${bgColor}
      ) no-repeat` };
}
const description = computed(() => {
  return props.description ? marked(props.description) : "";
});
</script>

<template>
  <button @click="start()" :style="style()">
    <img v-bind:src="props.image" />
    <div class="text">
      <div class="title">{{ props.title }}</div>
      <div class="description" v-html="description"></div>
    </div>
  </button>
</template>

<style scoped></style>
