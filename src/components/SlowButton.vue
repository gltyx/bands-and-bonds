<script setup lang="ts">
import { marked } from 'marked';
import { computed, onUnmounted, ref, watch, type PropType } from 'vue';
import { store } from '../store.ts';
import Fruit from './Fruit.vue';
import Gold from './Gold.vue';
const props = defineProps({
  timerKey: { type: String, required: false },
  title: { type: String, required: true },
  image: { type: String, required: true },
  duration: { type: Number, required: false },
  description: { type: String, required: false },
  autostart: { type: Boolean, default: false },
  cost: { type: Object as PropType<{ gold?: number; fruit?: number }>, default: () => ({}) },
});
function start() {
  if (!props.timerKey || !props.duration) return;
  store.startTimer(props.timerKey, {
    duration: props.duration,
    cost: props.cost,
    automatic: props.autostart || pointerDown.value,
  });
}
function style() {
  if (!props.duration || !props.timerKey) {
    return {};
  }
  if (!store.run.timers[props.timerKey]) {
    return { 'background': '#333' };
  }
  const percent = (store.run.timers[props.timerKey].time ?? 0) / props.duration * 100;
  const color = '#486';
  const bgColor = '#333';
  return {
    border: `1px solid ${color} !important`,
    background: `
    linear-gradient(
      95deg,
      ${color}, ${percent}%, ${color}, ${percent}%, ${bgColor}, ${bgColor}
      ) no-repeat` };
}
const description = computed(() => {
  return props.description ? marked(props.description) : "";
});
const affordable = computed(() => {
  const aff = store.run.gold >= (props.cost.gold ?? 0) && store.run.fruit >= (props.cost.fruit ?? 0);
  return aff;
});
watch(affordable, (newVal) => {
  if (newVal && props.autostart) {
    start();
  }
});
if (props.autostart && affordable.value) {
  start();
}
const running = computed(() => {
  return props.timerKey && !!store.run.timers[props.timerKey];
});
const pointerDown = ref(false);
watch(pointerDown, (newVal) => {
  if (!props.timerKey || props.autostart || !store.run.timers[props.timerKey]) return;
  store.run.timers[props.timerKey].automatic = newVal;
});
onUnmounted(() => {
  if (props.timerKey && store.run.timers[props.timerKey]) {
    delete store.run.timers[props.timerKey];
    // Refund price.
    store.run.gold += props.cost.gold ?? 0;
    store.run.fruit += props.cost.fruit ?? 0;
  }
});
</script>

<template>
  <button @click="start()" @pointerdown="pointerDown = true; start();" @pointerup="pointerDown = false"
    @pointercancel="pointerDown = false" @pointerleave="pointerDown = false" :style="style()"
    :class="{ disabled: !affordable || running }" class="slow">
    <img v-bind:src="props.image" />
    <div class="text">
      <div class="cost" v-if="(props.cost.gold ?? 0) > 0" :class="{ unaffordable: !affordable && !running }">
        <Gold :amount="props.cost.gold ?? 0" />
      </div>
      <div class="cost" v-if="(props.cost.fruit ?? 0) > 0" :class="{ unaffordable: !affordable && !running }">
        <Fruit :amount="props.cost.fruit ?? 0" />
      </div>
      <div class="title">{{ props.title }}</div>
      <div class="description" v-html="description"></div>
    </div>
  </button>
</template>

<style scoped>
.text {
  width: 100%;
}

.cost {
  float: right;
  margin: 5px;
}

.cost.unaffordable {
  color: red;
}
</style>
