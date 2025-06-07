<script setup lang="ts">
import { store } from "../store.ts";

const band = store.band;

function get(row: number, col: number): string | undefined {
  return band[col - 1 + (row - 1) * band.width];
}
function available(row: number, col: number): boolean {
  return (row + col) % 2 || get(row, col);
}

</script>

<template>
  <div class="band-grid">
    <div class="band-row" v-for="row in band.height" :key="row">
      <button class="band-cell" :class="{ unavailable: !available(row, col) }" v-for="col in band.width" :key="col">
        <img v-if="get(row, col)" :src="`/images/generated/${get(row, col)}.png`" />
        <span v-else-if="available(row, col)">
          ＋
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.band-grid {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.band-row {
  display: flex;
  justify-content: center;
  gap: 3px;
}

.band-cell {
  width: 100px;
  height: 100px;
  margin: 0;
  color: #333;
  background-color: #000;
  border-radius: 10px;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    border: 0;
  }
}

.band-cell.unavailable {
  border: 0;
}
</style>
