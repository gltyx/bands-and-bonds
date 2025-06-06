<script setup lang="ts">
import { store } from '../store.ts'
import Progress from './Progress.vue'
const props = defineProps({
  timerKey: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  duration: { type: Number, required: true },
});
const emit = defineEmits(['done']);
function start() {
  store.timers[props.timerKey] = { duration: props.duration, cb: () => emit("done") };
}
</script>

<template>

  <div class="slow-button">
    <Progress v-if="store.timers[props.timerKey] !== undefined" :value="store.timers[props.timerKey].time ?? 0"
      :max="store.timers[props.timerKey].duration">
      <img v-bind:src="props.image" width="60"/>
      {{ store.timers[props.timerKey].time }} / {{ store.timers[props.timerKey].duration }}
    </Progress>
    <button v-else @click="start()">
      <img v-bind:src="props.image" width="60"/>
      {{ props.title }}
    </button>
  </div>

</template>

<style scoped></style>
