<script setup lang="ts">
import { store } from "../store.ts";
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
  { x: 681, y: 483, type: "pickup", name: "campfire" },
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
    left: point.x - 15 + "px",
    top: point.y - 15 + "px",
  };
}

const line = computed(() => {
  const path = [];
  let last: Point | null = null;
  for (const p of points) {
    if (last === null) {
      path.push(`M ${p.x} ${p.y}`);
    } else {
      path.push(`L ${p.x} ${p.y}`);
    }
    last = p;
  }
  return path.join(" ");
});

</script>

<template>
  <div class="map">
    <img class="map" src="/images/generated/map.webp" alt="Map" @click="onClick" />
    { x: {{ pos.x }}, y: {{ pos.y }} }
    <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0;">
      <path :d="line" stroke="white" stroke-width="5" fill="none" />
    </svg>
    <template v-for="point in points" :key="point.name">
      <img v-if="point.type !== 'none'" :alt="point.name" :style="position(point)"
        :src="`/images/generated/${icon(point)}-outlined.webp`" class="marker" />
    </template>
  </div>
</template>

<style scoped>
.map {
  position: relative;
  width: 80vw;
  max-width: 800px;
  margin: 20px 0;
  border-radius: 40px;
  overflow: hidden;
}

img.map {
  width: 100%;
}

img.marker {
  pointer-events: none;
  position: absolute;
  width: 30px;
  height: 30px;
}
</style>
