<script setup lang="ts">
import { store } from "../store.ts";

const band = store.band;

function get(row: number, col: number): string | undefined {
  return band[col - 1 + (row - 1) * band.width];
}

</script>

<template>

  <div class="band-grid">
    <div class="band-row" v-for="row in band.height" :key="row">
      <div class="band-cell" v-for="col in band.width" :key="col">
        <img v-if="get(row, col)" :src="`/images/generated/${get(row, col)}.png`" />
        <div v-else class="empty-cell">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.band-grid {
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.band-row {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.band-cell {
  width: 100px;
  height: 100px;
  margin: 0;

  img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
}
</style>
