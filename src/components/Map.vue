<script setup lang="ts">
import { onboard, store } from "../store.ts";
import { enemiesByName } from "../enemies.ts";
import { friendsByName } from "../friends.ts";
import { allRooms, destinationToPath, roomKey, turnsToPath } from "../rooms.ts";
import type { Room } from "../base.ts";
import curvedLine from "./curved-line.ts";
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import EnemyRewards from "./EnemyRewards.vue";

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

const rooms = computed(() => turnsToPath(store.run.steps, store.run.turns));
const pos = ref({ x: 0, y: 0 });

function icon(room: Room) {
  return room.type.replace('rescue', 'pack');
}

function style(room: Room, factor?: number) {
  if (!mapElement.value) return { display: 'none' };
  const x = room.x * scale.value;
  const y = room.y * scale.value;
  let s = 30 * scale.value * (factor ?? 1);
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

function roomClicked(room: Room) {
  const key = roomKey(room);
  if ((onboard("Wayfinder") || onboard("Wayfindest")) && store.team.discovered.includes(key)) {
    store.local.destination = key;
  }
}

const line = computed(() => curvedLine(20, scale.value, rooms.value));
const planRooms = computed(() => (
  onboard("Wayfinder") || onboard("Wayfindest")) && store.local.destination ? destinationToPath(store.local.destination) : []);
const planLine = computed(() => curvedLine(20, scale.value, planRooms.value));
const hoveredRoom = ref<Room | null>(null);

</script>

<template>
  <div class="map" ref="mapElement">
    <div class="map-backdrop" />
    { x: {{ pos.x }}, y: {{ pos.y }} }
    <svg width="100%" height="100%">
      <path :d="line" stroke="white" :stroke-width="5 * scale" fill="none" />
      <path :d="planLine" stroke="white" :stroke-width="3 * scale" stroke-dasharray="3 5" fill="none" />
    </svg>
    <template v-for="room in allRooms">
      <img v-if="room.type !== 'none'" :alt="room.name" :style="style(room)"
        @mouseenter="pos = { x: room.x, y: room.y }; hoveredRoom = room" @mouseleave="hoveredRoom = null"
        :src="`images/generated/${icon(room)}-outlined.webp`"
        :class="{ marker: true, undiscovered: !store.team.discovered.includes(roomKey(room)) }"
        @click="roomClicked(room)" />
    </template>
    <img v-if="store.run.steps > 0" :style="style(rooms[rooms.length - 1], 2)" src="/images/generated/ring.webp"
      class="marker ring" />
    <div v-if="hoveredRoom?.name" class="hovered-room"
      :style="{ top: `${hoveredRoom.y}px`, left: `${hoveredRoom.x}px` }">
      <img class="enemy-portrait" :src="`images/generated/${hoveredRoom.name}.webp`" :alt="hoveredRoom.name" />
      <h1>{{ hoveredRoom.name }}</h1>
      <p v-if="enemiesByName[hoveredRoom.name]?.rewards">Rewards when defeated:
        <EnemyRewards :enemy="enemiesByName[hoveredRoom.name]" />
      </p>
      <p v-if="friendsByName[hoveredRoom.name]">{{ friendsByName[hoveredRoom.name].name }} was rescued here.</p>
    </div>
  </div>
</template>

<style scoped>
.map {
  width: 100%;
  max-width: 800px;
  position: relative;
  background-color: black;
  border-radius: 20px;
}

.map-backdrop {
  aspect-ratio: 1.5;
  margin: calc(min(20px, 2vw));
  background-image: url('/images/generated/map.webp');
  background-size: cover;
}

img.marker {
  position: absolute;
}

img.marker.undiscovered {
  filter: blur(2px) brightness(0.2);
}

img.marker.ring {
  pointer-events: none;
}

.hovered-room {
  pointer-events: none;
  position: absolute;
  background-color: black;
  color: white;
  padding: 0 10px;
  border-radius: 10px;
  z-index: 10;

  .enemy-portrait {
    margin-top: -30px;
    width: 60px;
    height: 60px;
    border-radius: 40%;
    border: 2px outset #edb;
    box-shadow: 0 0 10px #000;
    transition: filter 2s;
  }

  h1 {
    margin: 0;
    font-size: 20px;
  }
}

svg {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
