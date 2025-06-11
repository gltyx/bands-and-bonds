<script setup lang="ts">
import { store } from "../store.ts";
import curvedLine from "./curved-line.ts";
import { computed, ref } from "vue";

type Point = {
  x: number;
  y: number;
  type: "combat" | "pickup" | "none";
  name?: string;
};

const points: Point[] = [
  { x: 401, y: 483, type: "combat", name: "Wild Slime" },
  { x: 441, y: 483, type: "combat", name: "Animated Skeleton" },
  { x: 481, y: 483, type: "pickup", name: "fruit" },
  { x: 541, y: 483, type: "pickup", name: "gem" },
  { x: 581, y: 483, type: "pickup", name: "gold" },
  { x: 581, y: 413, type: "none" },
  { x: 641, y: 413, type: "pickup", name: "rescue" },
  { x: 641, y: 483, type: "pickup", name: "rescue" },
  { x: 661, y: 483, type: "pickup", name: "campfire" },
  { x: 661, y: 313, type: "none" },
  { x: 581, y: 313, type: "none" },
  { x: 581, y: 363, type: "none" },
  { x: 541, y: 363, type: "none" },
];

const pos = ref({ x: 0, y: 0 });

function onClick(e: MouseEvent) {
  pos.value = { x: e.offsetX, y: e.offsetY };
}

function icon(point: Point) {
  if (point.type === "combat") return "combat";
  if (point.type === "pickup") return point.name;
}

function position(point: Point) {
  return {
    left: `${point.x - 15}px`,
    top: `${point.y - 15}px`,
  };
}

const line = computed(() => curvedLine(20, points));

</script>

<template>
  <div class="map" @click="onClick">
    <div class="map-backdrop" />
    { x: {{ pos.x }}, y: {{ pos.y }} }
    <svg width="100%" height="100%">
      <path :d="line" stroke="white" stroke-width="5" fill="none" stroke-dasharray="15, 10" />
    </svg>
    <template v-for="point in points" :key="point.name">
      <img v-if="point.type !== 'none'" :alt="point.name" :style="position(point)"
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
  margin: 20px;
  background-image: url('/images/generated/map.webp');
  background-size: cover;
}

img.marker {
  pointer-events: none;
  position: absolute;
  width: 30px;
  height: 30px;
}

svg {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
