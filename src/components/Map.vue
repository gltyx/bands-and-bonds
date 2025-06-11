<script setup lang="ts">
import { store } from "../store.ts";
import { type Room, allRooms, getPath } from "../rooms.ts";
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

const rooms = computed(() => getPath(store.run.steps, store.run.turns));
const pos = ref({ x: 0, y: 0 });

function onClick(e: MouseEvent) {
  if (!mapElement.value) return;
  pos.value = { x: e.pageX - mapElement.value.offsetLeft, y: e.pageY - mapElement.value.offsetTop };
}

function icon(room: Room) {
  return room.type;
}

function style(room: Room) {
  if (!mapElement.value) return { display: 'none' };
  const x = room.x * scale.value;
  const y = room.y * scale.value;
  let s = 30 * scale.value;
  if (room.type === 'boss') {
    s *= 1.2;
  }
  if (room.type === 'finalboss') {
    s *= 2;
  }
  return {
    left: `${x - s / 2}px`,
    top: `${y - s / 2}px`,
    width: `${s}px`,
    height: `${s}px`,
  };
}

const line = computed(() => curvedLine(20, scale.value, rooms.value));

</script>

<template>
  <div class="map" @click="onClick" ref="mapElement">
    <div class="map-backdrop" />
    { x: {{ pos.x }}, y: {{ pos.y }} }
    <svg width="100%" height="100%">
      <path :d="line" stroke="white" :stroke-width="5 * scale" fill="none" />
    </svg>
    <template v-for="room in allRooms">
      <img v-if="room.type !== 'none'" :alt="room.name" :style="style(room)"
        @mouseenter="pos = { x: room.x, y: room.y }" :src="`/images/generated/${icon(room)}-outlined.webp`"
        :class="{ marker: true, undiscovered: !rooms.includes(room) }" />
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
  position: absolute;
  width: 30px;
  height: 30px;
}

img.marker.undiscovered {
  filter: blur(2px) brightness(0.2);
}

svg {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
