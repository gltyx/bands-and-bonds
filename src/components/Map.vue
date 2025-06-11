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
    next: { 'Turn right': 'right1', 'Turn left': 'left1', 'Go straight': 'straight1' }
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
  { x: 347, y: 359, type: "pickup", name: "campfire" },
  { x: 288, y: 359, type: "none" },
  { x: 288, y: 343, type: "combat" },
  { x: 288, y: 293, type: "combat" },
  { x: 288, y: 236, type: "combat" },
  { x: 288, y: 219, type: "none" },
  { x: 351, y: 219, type: "combat", end: true },
];
const points = computed(() => {
  const points = [] as Point[];
  const steps = ['Go straight'];
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
  const w = 30 * scale.value;
  const h = 30 * scale.value;
  return {
    left: `${x - w / 2}px`,
    top: `${y - h / 2}px`,
    width: `${w}px`,
    height: `${h}px`,
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
