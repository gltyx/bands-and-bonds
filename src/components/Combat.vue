<script setup lang="ts">
import { store, friends, enemies, damage, runData, type Ability } from "../store.ts";
import SlowButton from "./SlowButton.vue";
import Progress from "./Progress.vue";
import { computed } from "vue";

const enemy = computed(() => enemies[store.run.enemy]);
const abilities = computed(() => {
  const abilities = [] as Ability[];
  for (let row = 0; row < store.band.height; row++) {
    for (let col = 0; col < store.band.width; col++) {
      const place = col + row * store.band.width;
      const friend = friends[store.band[place]];
      for (const ab of friend?.abilities ?? []) {
        abilities.push(ab);
      }
    }
  }
  return abilities;
});

function executeAbility(ab: Ability) {
  if (ab.onCompleted) {
    return ab.onCompleted();
  }
  if (ab.damage) {
    damage(ab.damage * store.run.weaponLevel);
  }
}

function retreat() {
  if (window.confirm("Are you sure you want to retreat?")) {
    store.run = runData();
  }
}

function describe(ab: Ability): string {
  let d = ab.description;
  if (typeof d === "function") {
    d = d();
  }
  if (ab.damage) {
    d += `\n\n${ab.damage * store.run.weaponLevel} damage`;
  }
  return d;
}
</script>

<template>

  <div class="enemy">
    <div class="description">Currently fighting:</div>
    <h1>{{ enemy.name }}</h1>
    <img :src="`/images/generated/${enemy.name}.webp`" :alt="enemy.name" />
    <Progress :value="enemy.health - store.run.damage" :max="enemy.health" color="#c00">
      {{ enemy.health - store.run.damage }} / {{ enemy.health }} HP
    </Progress>
  </div>
  <div class="card" v-for="ab in abilities" :key="ab.name">
    <SlowButton :timer-key="`ability-${ab.name}`" :title="ab.name" :description="describe(ab)"
      :image="`/images/generated/${ab.name}.webp`" :duration="ab.duration * 1000" @done="executeAbility(ab)" />
  </div>
  <div class="card">
    <button @click="retreat()">
      <img src="/images/generated/Retreat.webp" />
      <div class="text">
        <div class="title">Retreat</div>
        <div class="description">
          Leave the dungeon and return to safety. Live to fight another day.
        </div>
      </div>
    </button>
  </div>

</template>

<style scoped>
.enemy {
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    margin-top: -5px;
    margin-bottom: 10px;
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 40%;
    border: 2px outset #edb;
    box-shadow: 0 0 10px #000;
  }
}
</style>
