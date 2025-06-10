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
    left: point.x - 15 + "px",
    top: point.y - 15 + "px",
  };
}

const line = computed(() => {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const { x: x0, y: y0 } = points[i - 1];
    const { x: x1, y: y1 } = points[i];
    const { x: x2, y: y2 } = points[i + 1];

    // Vector directions
    const dx1 = x1 - x0;
    const dy1 = y1 - y0;
    const dx2 = x2 - x1;
    const dy2 = y2 - y1;

    // Ensure this is an L-bend (90 degrees)
    if ((dx1 === 0 && dy2 === 0) || (dy1 === 0 && dx2 === 0)) {
      // Inward direction
      const len1 = Math.hypot(dx1, dy1);
      const len2 = Math.hypot(dx2, dy2);

      const RADIUS = 20;
      const r = Math.min(RADIUS, len1 / 2, len2 / 2); // Avoid overshooting short segments

      // Point before the corner
      const xLine1 = x1 - Math.sign(dx1) * r;
      const yLine1 = y1 - Math.sign(dy1) * r;

      // Point after the corner
      const xLine2 = x1 + Math.sign(dx2) * r;
      const yLine2 = y1 + Math.sign(dy2) * r;

      // Draw line to corner - r
      d += ` L ${xLine1} ${yLine1}`;

      // Arc to corner + r
      const isClockwiseTurn = dx1 * dy2 - dy1 * dx2 > 0;
      d += ` A ${r} ${r} 0 0 ${isClockwiseTurn ? 1 : 0} ${xLine2} ${yLine2}`;
    } else {
      // Not a corner (could be straight)
      d += ` L ${x1} ${y1}`;
    }
  }

  // Final segment
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
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
