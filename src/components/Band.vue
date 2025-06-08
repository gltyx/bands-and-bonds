<script setup lang="ts">
import { computed, ref } from "vue";
import { marked } from 'marked';
import { store, friends } from "../store.ts";

const selected = ref(undefined as string | undefined);
const band = store.band;

function get(row: number, col: number): string | undefined {
  return band[col - 1 + (row - 1) * band.width];
}
function available(row: number, col: number): boolean {
  return (row + col) % 2 || get(row, col);
}
function unused(name: string): boolean {
  return !store.unassigned.includes(name) && !Object.values(store.band).includes(name);
}
function remove(name: string) {
  if (store.unassigned.includes(name)) {
    store.unassigned.splice(store.unassigned.indexOf(name), 1);
  } else {
    for (const key in store.band) {
      if (store.band[key] === name) {
        delete store.band[key];
      }
    }
  }
}
function set(row: number, col: number, name: string) {
  if (store.unassigned.includes(name) && available(row, col)) {
    store.band[col - 1 + (row - 1) * band.width] = name;
    store.unassigned.splice(store.unassigned.indexOf(name), 1);
  }
}
function clear(row: number, col: number) {
  selected.value = get(row, col);
  delete store.band[col - 1 + (row - 1) * band.width];
  store.unassigned.push(selected.value);
}

const description = computed(() => {
  const description = friends?.[selected.value]?.description;
  return description ? marked(description) : "";
});
</script>

<template>
  <div class="band-grid">
    <div class="band-row" v-for="row in band.height" :key="row">
      <template v-for="col in band.width" :key="col">
        <button v-if="get(row, col)" class="band-cell" :class="{ unavailable: !available(row, col) }"
          @click="clear(row, col);">
          <img v-if="get(row, col)" :src="`/images/generated/${get(row, col)}.webp`" />
        </button>
        <button v-else-if="available(row, col)" class="band-cell" @click="set(row, col, selected)">
          ＋
        </button>
        <button v-else class="band-cell unavailable">
        </button>
      </template>
    </div>
  </div>
  <h2 v-if="store.unassigned.length">Not in formation:</h2>
  <div class="band-unassigned">
    <button class="band-cell" v-for="name in store.unassigned" :key="name" @click="selected = name">
      <img :src="`/images/generated/${name}.webp`" />
    </button>
  </div>
  <div class="band-details" v-if="selected">
    <img :src="`/images/generated/${selected}.webp`" />
    <h1>{{ selected }}</h1>
    <div class="description" v-html="description"></div>
    <button v-if="unused(selected)" @click="store.unassigned.push(selected)">
      ⬆ Add to band
    </button>
    <button v-else @click="remove(selected)">
      ⬇ Remove from band
    </button>
  </div>
  <h2 v-if="store.unlocked.some(name => unused(name))">Not in band:</h2>
  <div class="band-unlocked">
    <template v-for="name in store.unlocked" :key="name">
      <button class="band-cell" v-if="unused(name)" @click="selected = name">
        <img :src="`/images/generated/${name}.webp`" />
      </button>
    </template>
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

.band-unassigned,
.band-unlocked {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: center;
}

.band-details {
  background-color: #000;
  border-radius: 30px;
  /* overflow: hidden; */
  margin: 20px 0;
  padding: 20px;
  box-sizing: border-box;

  img {
    width: 200px;
    mix-blend-mode: lighten;
    margin-top: -45px;
  }

  h1 {
    margin-top: -15px;
    margin-bottom: 0;
  }

  p {
    margin: 10px 0;
  }
}

h2 {
  margin-bottom: 0;
  font-family: 'Grenze Gotisch', serif;
}
</style>
