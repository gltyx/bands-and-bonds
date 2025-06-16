<script setup lang="ts">
import { computed, ref } from "vue";
import SlowButton from "./SlowButton.vue";
import { store, friendsByName, describeAbility, type Friend } from "../store.ts";

const selected = ref(undefined as string | undefined);
const band = store.band;

function get(row: number, col: number): Friend | undefined {
  return friendsByName[band[col - 1 + (row - 1) * band.width]];
}
function imageFor(row: number, col: number): string | undefined {
  const friend = get(row, col);
  if (!friend) return undefined;
  const imageName = nextToAzrekta(row, col) && friend.super?.name || friend.name;
  return `/images/generated/${imageName}.webp`;
}
function available(row: number, col: number): boolean {
  const dist = Math.max(Math.abs(row - 3), Math.abs(col - 3));
  if (lightRadius.value === 'radius3') return true;
  if (lightRadius.value === 'radius2') return dist <= 1;
  return dist === 0;
}
function unused(name: string): boolean {
  return !Object.values(store.band).includes(name);
}
function remove(name: string) {
  for (const key in store.band) {
    if (store.band[key] === name) {
      delete store.band[key];
    }
  }
}
function set(row: number, col: number, name: string) {
  if (unused(name) && available(row, col)) {
    store.band[col - 1 + (row - 1) * band.width] = name;
  }
}
function clear(row: number, col: number) {
  selected.value = get(row, col)?.name;
  if (!selected.value) return;
  delete band[col - 1 + (row - 1) * band.width];
  // Drop anyone who is now on unlit tiles.
  for (let r = 1; r <= band.height; r++) {
    for (let c = 1; c <= band.width; c++) {
      if (!available(r, c)) {
        const place = c - 1 + (r - 1) * band.width;
        const friend = band[place];
        if (friend) {
          delete band[place];
        }
      }
    }
  }
}

function nextToAzrekta(row: number, col: number): boolean {
  const az = (x: number, y: number) => get(x, y)?.name === 'Azrekta';
  return az(row - 1, col) || az(row + 1, col) || az(row, col - 1) || az(row, col + 1);
}

const lightRadius = computed(() => {
  const lamplighter = get(3, 3)?.name === 'Lamplighter';
  if (!lamplighter) return 'radius1';
  if (nextToAzrekta(3, 3)) {
    return 'radius3';
  }
  return 'radius2';
});

const selectedFriend = computed(() => {
  for (let row = 0; row < store.band.height; row++) {
    for (let col = 0; col < store.band.width; col++) {
      const place = col + row * store.band.width;
      const name = store.band[place];
      const friend = friendsByName[name];
      if (name === selected.value) {
        if (nextToAzrekta(row + 1, col + 1)) {
          return { ...friend, ...friend.super };
        }
        return friend;
      }
    }
  }
  return selected.value ? friendsByName[selected.value] : undefined;
});

function friendClicked(row: number, col: number) {
  const friend = get(row, col);
  if (selected.value === friend?.name) {
    clear(row, col);
  } else {
    selected.value = friend?.name;
  }
}
</script>

<template>
  <div class="band-grid">
    <img class="light-ring" :src="`/images/generated/light-ring.webp`" :class="lightRadius" />
    <div class="band-row" v-for="row in band.height" :key="row">
      <template v-for="col in band.width" :key="col">
        <button v-if="get(row, col)" class="band-cell" :class="{ unavailable: !available(row, col) }"
          @click="friendClicked(row, col)">
          <img v-if="get(row, col)" :src="imageFor(row, col)" />
        </button>
        <button v-else-if="available(row, col)" class="band-cell" @click="selected && set(row, col, selected)">
          ＋
        </button>
        <button v-else class="band-cell unavailable">
        </button>
      </template>
    </div>
  </div>
  <div class="below-grid">
    <div class="band-unlocked">
      <template v-for="name in store.unlocked" :key="name">
        <button class="band-cell" v-if="unused(name)" @click="selected = name">
          <img :src="`/images/generated/${name}.webp`" />
        </button>
      </template>
    </div>
    <div class="band-details" v-if="selected && selectedFriend">
      <img :src="`/images/generated/${selectedFriend.name}.webp`" />
      <h1>{{ selectedFriend.name }}</h1>
      <div class="description" v-html="selectedFriend.descriptionHtml"></div>
      <template v-for="ab in selectedFriend.abilities" :key="ab.name">
        <SlowButton :timer-key="`ability-${ab.name}`" :title="ab.name" :description="describeAbility(ab)"
          :image="`/images/generated/${ab.name}.webp`" />
      </template>
      <button v-if="unused(selected)">
        ⬆ Click on a tile to add {{ selected }} to your band
      </button>
      <button v-else @click="remove(selected)">
        ⬇ Remove from band
      </button>
    </div>
  </div>
</template>

<style scoped>
.band-grid {
  display: flex;
  flex-direction: column;
  gap: 3px;
  position: relative;
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
  padding: 10px;
  color: #333;
  background-color: #000;
  border-radius: 10px;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 2;

  img {
    width: 100%;
    height: 100%;
    border: 0;
  }
}

.band-cell.unavailable {
  border: 0;
}

.light-ring.radius1 {
  width: 150px;
}

.light-ring.radius2 {
  width: 306px;
}

.light-ring.radius3 {
  width: 512px;
}

.light-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  border-radius: 10px;
}

.band-unlocked {
  flex: 1 1;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: center;
  min-width: 350px;
}

.band-details {
  flex: 1 1;
  background-color: #000;
  border-radius: 30px;
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

  .description {
    margin-bottom: 20px;
  }

}

.below-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  gap: 20px;
}

h2 {
  margin-bottom: 0;
  font-family: 'Grenze Gotisch', serif;
  font-weight: 200;
}
</style>
