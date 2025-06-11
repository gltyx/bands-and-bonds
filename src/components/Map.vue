<script setup lang="ts">
import { store } from "../store.ts";
import curvedLine from "./curved-line.ts";
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";

const mapElement = useTemplateRef('mapElement');
const scale = ref(1.0);

const resizeObserver = new ResizeObserver(() => {
  if (!mapElement.value) return;
  scale.value = mapElement.value.clientWidth / 800;
});
onMounted(() => {
  if (!mapElement.value) return;
  scale.value = mapElement.value.clientWidth / 800;
  resizeObserver.observe(mapElement.value);
});
onUnmounted(() => {
  resizeObserver.disconnect();
});

type Point = {
  x: number;
  y: number;
  type: "combat" | "pickup" | "none";
  name?: string;
  next?: Record<string, string>; // The path diverges.
  label?: string; // Referenced from "next", like a goto label.
  end?: boolean; // If true, this is the end of the path.
};

const allPoints: Point[] = [
  { x: 409, y: 507, type: "none" },
  { x: 409, y: 484, type: "combat", name: "Wild Slime" },
  {
    x: 409, y: 419, type: "combat", name: "Animated Skeleton",
    next: { 'Turn right': 'right1', 'Turn left': 'left1', 'Go straight': 'straight1' },
  },
  { x: 455, y: 419, type: "pickup", name: "fruit", label: 'right1' },
  { x: 501, y: 419, type: "pickup", name: "gem" },
  { x: 501, y: 477, type: "pickup", name: "gold" },
  { x: 454, y: 477, type: "combat", end: true },

  { x: 345, y: 419, type: "pickup", name: "rescue", label: 'left1' },
  { x: 304, y: 419, type: "none" },
  { x: 304, y: 493, type: "none" },
  { x: 350, y: 493, type: "none" },
  { x: 350, y: 461, type: "combat", end: true },

  { x: 409, y: 359, type: "pickup", name: "rescue", label: 'straight1' },
  { x: 342, y: 359, type: "pickup", name: "campfire" },
  { x: 288, y: 359, type: "none" },
  { x: 288, y: 343, type: "combat" },
  { x: 288, y: 293, type: "combat" },
  {
    x: 288, y: 236, type: "combat",
    next: { 'Turn left': 'left2', 'Go straight': 'straight2' },
  },
  { x: 288, y: 219, type: "none", label: 'straight2' },
  { x: 351, y: 219, type: "combat" },
  { x: 351, y: 244, type: "none" },
  { x: 332, y: 244, type: "none" },
  { x: 332, y: 279, type: "combat" },
  { x: 332, y: 318, type: "combat" },
  { x: 358, y: 318, type: "none" },
  { x: 358, y: 289, type: "none" },
  { x: 405, y: 289, type: "combat", end: true },

  { x: 288, y: 243, type: "none", label: 'left2' },
  { x: 248, y: 243, type: "combat" },
  { x: 243, y: 243, type: "none" },
  { x: 243, y: 341, type: "combat" },
  { x: 243, y: 379, type: "none" },
  { x: 277, y: 379, type: "none" },
  {
    x: 277, y: 413, type: "none",
    next: { 'Turn left': 'left3', 'Go straight': 'straight3' },
  },
  { x: 243, y: 413, type: "combat", label: 'left3', end: true },
  {
    x: 277, y: 459, type: "none", label: 'straight3',
    next: { 'Turn left': 'left4', 'Go straight': 'straight4' },
  },
  { x: 243, y: 459, type: "combat", label: 'left4', end: true },
  { x: 277, y: 498, type: "none", label: 'straight4' },
  {
    x: 196, y: 498, type: "none",
    next: { 'Go straight': 'straight5', 'Turn right': 'right5' },
  },
  { x: 196, y: 460, type: "combat", label: 'right5' },
  { x: 196, y: 410, type: "combat" },
  { x: 196, y: 350, type: "combat" },
  { x: 196, y: 300, type: "combat", end: true },
  {
    x: 126, y: 498, type: "none", label: 'straight5',
    next: { 'Go straight': 'straight6', 'Turn right': 'right6' },
  },
  { x: 126, y: 466, type: "combat", label: 'right6' },
  { x: 126, y: 390, type: "pickup", name: 'fruit', end: true },
  { x: 68, y: 498, type: "none", label: 'straight6' },
  { x: 68, y: 323, type: "none" },
  { x: 124, y: 323, type: "pickup", name: 'boss' },

  { x: 407, y: 127, type: "pickup", name: 'finalboss' },
];
const points = computed(() => {
  const points = [] as Point[];
  const steps = ['Go straight', 'Turn left', 'Go straight', 'Go straight', 'Go straight', 'Go straight'];
  let target = undefined as string | undefined;
  for (const point of allPoints) {
    if (target && point.label === target) {
      target = undefined;
    }
    if (target) continue;
    points.push(point);
    if (point.end) return points;
    if (point.next) {
      const step = steps.shift() ?? '';
      target = point.next[step];
    }
  }
  return points;
});
const pos = ref({ x: 0, y: 0 });

function onClick(e: MouseEvent) {
  if (!mapElement.value) return;
  pos.value = { x: e.pageX - mapElement.value.offsetLeft, y: e.pageY - mapElement.value.offsetTop };
}

function icon(point: Point) {
  if (point.type === "combat") return "combat";
  if (point.type === "pickup") return point.name;
}

function style(point: Point) {
  if (!mapElement.value) return { display: 'none' };
  const x = point.x * scale.value;
  const y = point.y * scale.value;
  let s = 30 * scale.value;
  if (point.name === 'boss') {
    s *= 1.2;
  }
  if (point.name === 'finalboss') {
    s *= 2;
  }
  return {
    left: `${x - s / 2}px`,
    top: `${y - s / 2}px`,
    width: `${s}px`,
    height: `${s}px`,
  };
}

const line = computed(() => curvedLine(20, scale.value, points.value));

</script>

<template>
  <div class="map" @click="onClick" ref="mapElement">
    <div class="map-backdrop" />
    { x: {{ pos.x }}, y: {{ pos.y }} }
    <svg width="100%" height="100%">
      <path :d="line" stroke="white" :stroke-width="5 * scale" fill="none" />
    </svg>
    <template v-for="point in points" :key="point.name">
      <img v-if="point.type !== 'none'" :alt="point.name" :style="style(point)"
        :src="`/images/generated/${icon(point)}-outlined.webp`" class="marker" />
    </template>
  </div>
</template>

<style scoped>
.map {
  width: 80vw;
  max-width: 800px;
  position: relative;
  background-color: black;
  border-radius: 20px;
  overflow: hidden;
}

.map-backdrop {
  aspect-ratio: 1.5;
  margin: calc(min(20px, 2vw));
  background-image: url('/images/generated/map.webp');
  background-size: cover;
}

img.marker {
  pointer-events: none;
  position: absolute;
  width: 30px;
  height: 30px;
}

img.marker.undiscovered {
  filter: blur(2px) brightness(0.2);
}

svg {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
